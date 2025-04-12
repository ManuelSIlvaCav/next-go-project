package jobtasker

import (
	"fmt"

	"github.com/hibiken/asynq"
)

type JobTasker struct {
	jobClient *asynq.Client
	mux       *asynq.ServeMux
}

func NewJobTasker(host string, port int, password string) *JobTasker {
	mux := asynq.NewServeMux()

	jobClient := asynq.NewClient(asynq.RedisClientOpt{
		Addr: fmt.Sprintf("%s:%d", host, port),
		//Username: config.Redis.Username,
		Password: password,
	})

	return &JobTasker{
		jobClient: jobClient,
		mux:       mux,
	}
}

func (c *JobTasker) JobClient() *asynq.Client {
	return c.jobClient
}

func (c *JobTasker) Mux() *asynq.ServeMux {
	return c.mux
}
