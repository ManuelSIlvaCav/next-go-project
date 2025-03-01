package businesses_services

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
)

type DomainService struct {
	container *container.Container
}

type DomainRequest struct {
	Name string `json:"name"`
}

func NewDomainService(container *container.Container) *DomainService {
	return &DomainService{
		container: container,
	}
}

func (d *DomainService) AddDomainToVercel(domain string) (map[string]interface{}, error) {
	logger := d.container.Logger()

	projectID := d.container.Config().Vercel.ProjectId
	authBearerToken := d.container.Config().Vercel.AuthToken

	url := "https://api.vercel.com/v10/projects/" + projectID + "/domains"

	if teamID := os.Getenv("TEAM_ID_VERCEL"); teamID != "" {
		url += "?teamId=" + teamID
	}

	logger.Info("Adding domain to vercel", "url", url, "projectID", projectID, "token", authBearerToken)

	domainRequest := DomainRequest{Name: domain}

	body, err := json.Marshal(domainRequest)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+authBearerToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result, nil
}
