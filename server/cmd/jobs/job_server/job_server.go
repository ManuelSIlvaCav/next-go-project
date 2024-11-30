package job_server

import (
	"fmt"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/jobs/tasks"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/files"
	"github.com/hibiken/asynq"
)

type JobServer struct {
	Container       *container.Container
	Server          *asynq.Server
	FilesModule     *files.FilesModule
	InternalModules *modules.InternalModule
}

func NewJobServer(container *container.Container,
	filesModule *files.FilesModule,
	internalModules *modules.InternalModule) *JobServer {
	newJobServer := &JobServer{Container: container, FilesModule: filesModule, InternalModules: internalModules}
	return newJobServer
}

func (js *JobServer) Run() *asynq.Server {
	logger := js.Container.Logger()
	config := js.Container.Config()

	redisURL := config.RedisURL()

	logger.Info("Starting job server implementation", "redis_url", redisURL)

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

	allTasks := js.InternalModules.Tasks()
	for _, task := range allTasks {
		mux.Handle(task.Pattern, task.Handler)
	}

	mux.Handle(tasks.TypeHelloWorld, tasks.NewHelloWorldProcessor(js.Container))
	/* mux.Handle(tasks.TypeUploadClients, tasks.NewUploadClientsProcessor(js.Container, js.FilesModule)) */

	go srv.Run(mux)

	return srv
}
