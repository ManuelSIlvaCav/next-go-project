package job_server

import (
	"fmt"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/jobs/tasks"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/hibiken/asynq"
)

type JobServer struct {
	Container *container.Container
	Server    *asynq.Server
}

func NewJobServer(container *container.Container) *JobServer {
	newJobServer := &JobServer{Container: container}
	return newJobServer
}

func (js *JobServer) Run() *asynq.Server {
	logger := js.Container.Logger()
	config := js.Container.Config()

	redisURL := config.RedisURL()

	logger.Info("Starting job server", "redis_url", redisURL)
	srv := asynq.NewServer(
		asynq.RedisClientOpt{
			Addr: fmt.Sprintf("%s:%d", config.Redis.Host, config.Redis.Port),
			//Username: config.Redis.Username,
			Password: config.Redis.Password,
		},
		asynq.Config{
			// Specify how many concurrent workers to use
			Concurrency: 10,
			// Optionally specify multiple queues with different priority.
			Queues: map[string]int{
				"critical": 6,
				"default":  3,
				"low":      1,
			},
			// See the godoc for other configuration options
		},
	)

	// mux maps a type to a handler
	mux := asynq.NewServeMux()
	mux.Handle(tasks.TypeHelloWorld, tasks.NewHelloWorldProcessor(js.Container))

	if err := srv.Run(mux); err != nil {
		logger.Error("could not run server", "error", err)
	}

	return srv
}
