package files

import (
	"server/internal/container"
	files_handlers "server/internal/files/handlers"
	r "server/internal/router"
)

type FilesModule struct {
	FileService FileService
}

func NewFilesModule(container *container.Container, router *r.Router) *FilesModule {

	routes := []r.Route{}

	routes = append(routes,
		router.BuildRoute("POST", "/upload-file", files_handlers.UploadFile(container)),
	)

	router.SetRoutes("/files", routes)

	return &FilesModule{
		FileService: NewS3Service(container),
	}
}
