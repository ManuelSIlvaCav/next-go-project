package files

import "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"

type FileService interface {
}

type S3Service struct {
	Container *container.Container
}

func NewS3Service(container *container.Container) *S3Service {
	return &S3Service{}
}
