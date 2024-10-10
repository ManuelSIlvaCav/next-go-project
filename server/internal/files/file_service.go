package files

import "server/internal/container"

type FileService interface {
}

type S3Service struct {
	container *container.Container
}

func NewS3Service(container *container.Container) *S3Service {
	return &S3Service{}
}
