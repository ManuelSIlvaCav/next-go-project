package files

import (
	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	files_handlers "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/files/handlers"
)

type FilesModule struct {
	FileService FileService
	container   *container.Container
}

func NewFilesModule(container *container.Container) *FilesModule {

	return &FilesModule{
		FileService: NewS3Service(container),
		container:   container,
	}
}

func (f *FilesModule) GetDomain() string {
	return "/files"
}

func (f *FilesModule) GetHandlers() []internal_models.Route {
	routes := []internal_models.Route{}

	routes = append(routes,
		internal_models.Route{
			Method:        "POST",
			Path:          "/upload-file",
			Handler:       files_handlers.UploadFile(f.container),
			Description:   "Upload a file",
			Authenticated: true,
		},
	)
	return routes

}