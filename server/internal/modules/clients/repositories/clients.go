package clients

type ClientRepository struct {
}

func NewClientRepository() *ClientRepository {
	return &ClientRepository{}
}

func (c *ClientRepository) GetClients() []string {
	clients := []string{"client1", "client2", "client3"}
	//Get the clients from the database
	return clients
}
