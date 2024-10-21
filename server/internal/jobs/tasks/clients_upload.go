package tasks

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"io"
	"sync"

	clients "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/clients/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/files"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
	"github.com/hibiken/asynq"
)

/* We save the csv file previously on a storage so we pass the url to the task */
type UploadClientsPayload struct {
	FileName string `json:"file_name"`
}

const maxGoRoutines = 5

func NewUploadClientsTask(fileURL string) (*asynq.Task, error) {
	payload, err := json.Marshal(UploadClientsPayload{
		FileName: fileURL,
	})
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(TypeUploadClients, payload), nil
}

type UploadClientsProcessor struct {
	Container   *container.Container
	FilesModule *files.FilesModule
}

func NewUploadClientsProcessor(container *container.Container,
	filesModule *files.FilesModule,
) *UploadClientsProcessor {
	return &UploadClientsProcessor{Container: container, FilesModule: filesModule}
}

/* Process task for uploading client */
func (p *UploadClientsProcessor) ProcessTask(ctx context.Context, t *asynq.Task) error {
	defer utils.Timer("UploadClientsProcessor")()
	var payload UploadClientsPayload
	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		return err
	}
	logger := p.Container.Logger()

	// Here we can use the file service to download the file and process it
	buffer, err := p.FilesModule.FileService.LoadFile(payload.FileName)

	if err != nil {
		logger.Error("Failed to load file", "error", err)
		return err
	}

	//Read the file with csv reader
	csvReader := csv.NewReader(buffer)

	var wg sync.WaitGroup
	channel := make(chan int, maxGoRoutines)

	i := 0
	recordSlice := make([][]string, 0)

	for {
		record, err := csvReader.Read()

		if err == io.EOF {
			//If we have records pending to save
			if len(recordSlice) > 0 {
				logger.Info("Saving last batch of clients", "records", len(recordSlice))
				p.saveClientsBatch(recordSlice)
			}
			break
		} else if err != nil {
			logger.Error("Failed to read csv file", "error", err)
			return nil
		}

		//Skip the header
		if i == 0 {
			i++
			continue
		}

		recordSlice = append(recordSlice, record)
		i++

		if i == 101 {
			wg.Add(1)
			channel <- 1
			newSlice := make([][]string, len(recordSlice))
			copy(newSlice, recordSlice)

			go func(records [][]string) {
				defer func() { wg.Done(); <-channel }()
				//Copy the values into a new struct to avoid conflicts
				p.saveClientsBatch(records)
			}(newSlice)

			i = 1
			recordSlice = make([][]string, 0)
		}

	}

	wg.Wait()
	close(channel)

	return nil
}

func (p *UploadClientsProcessor) saveClientsToDB(record []string) error {
	logger := p.Container.Logger()
	db := p.Container.DB()
	// Here we can save the records to the database
	//["Index","Customer Id","First Name","Last Name","Company","City","Country","Phone 1","Phone 2","Email","Subscription Date","Website"]

	customer := &clients.Client{
		FirstName: record[2],
		LastName:  record[3],
		Email:     record[9],
	}

	stmt, err := db.Db.PrepareNamed("INSERT INTO clients (first_name, last_name, email) VALUES (:first_name, :last_name, :email) RETURNING id")

	if err != nil {
		logger.Error("Failed to insert client", "error", err)
		return err
	}

	err = stmt.Get(&customer.ID, customer)

	if err != nil {
		logger.Error("Failed to insert client", "error", err)
		return err
	}

	//logger.Info("Client saved", "client", customer)

	contact := &clients.Contact{
		ClientID: customer.ID,
		Phone:    record[7],
		Email:    record[9],
	}

	//Save the client infrmation to the database
	if _, err := p.Container.DB().Db.NamedExecContext(
		context.Background(),
		"INSERT INTO client_contacts_information (client_id, phone, email) VALUES (:client_id, :phone, :email)",
		contact,
	); err != nil {
		p.Container.Logger().Error("Failed to insert client", "error", err)
	}

	//logger.Info("Client information saved", "client", customer)

	return nil

}

func (p *UploadClientsProcessor) saveClientsBatch(records [][]string) {
	logger := p.Container.Logger()

	logger.Info("Saving batch of clients", "records", len(records))

	db := p.Container.DB().Db

	clientsSlice := make([]*clients.Client, 0)

	for _, record := range records {
		client := &clients.Client{
			FirstName: record[2],
			LastName:  record[3],
			Email:     record[9],
		}

		clientsSlice = append(clientsSlice, client)
	}

	//Insert the clients

	upsertQuery := "INSERT INTO clients (first_name, last_name, email) VALUES (:first_name, :last_name, :email)"

	/* onConflictStatement := " ON CONFLICT (user_id, name) DO UPDATE SET address = excluded.address,eligible = excluded.eligible, updated_at = now() RETURNING *" */

	query, queryArgs, _ := db.BindNamed(upsertQuery, clientsSlice)
	query = db.Rebind(query)
	//query = query + onConflictStatement
	rows, err := db.Queryx(query, queryArgs...)

	if err != nil {
		logger.Error("Failed to insert clients", "error", err)
		return
	}

	rows.Close()

}
