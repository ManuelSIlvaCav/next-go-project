package files

import (
	"context"
	"io"

	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type FileService interface {
	UploadFile(fileName string, body io.Reader) (string, error)
	LoadFile(fileName string) (io.Reader, error)
}

type S3Service struct {
	Container *container.Container
}

func NewS3Service(container *container.Container) *S3Service {
	return &S3Service{
		Container: container,
	}
}

func (s *S3Service) LoadStorage() (bool, error) {
	logger := s.Container.Logger()

	cfg := s.Container.AwsConfig().Config

	// Create an Amazon S3 service client
	client := s3.NewFromConfig(cfg)

	// Get the first page of results for ListObjectsV2 for a bucket
	output, err := client.ListObjectsV2(context.TODO(), &s3.ListObjectsV2Input{
		Bucket: aws.String("my-bucket"),
	})

	if err != nil {
		logger.Error("failed to list objects, %v", err)
		return false, err
	}

	logger.Info("Objects:")

	for _, object := range output.Contents {
		logger.Info("key=%s size=%d", aws.ToString(object.Key), object.Size)
	}

	return true, nil
}

func (s *S3Service) LoadFile(fileName string) (io.Reader, error) {
	client := s3.NewFromConfig(s.Container.AwsConfig().Config)

	output, err := client.GetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String("project-x-eu-1"),
		Key:    aws.String(fileName),
	})

	if err != nil {
		return nil, err
	}

	return output.Body, nil
}

func (s *S3Service) UploadFile(fileName string, body io.Reader) (string, error) {

	logger := s.Container.Logger()

	client := s3.NewFromConfig(s.Container.AwsConfig().Config)

	logger.Info("Uploading file to S3", "client", client)

	_, err := client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String("project-x-eu-1"),
		Key:    aws.String(fileName),
		Body:   body,
	})

	if err != nil {
		return "", err
	}

	return fileName, nil
}
