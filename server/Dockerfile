# Go Version
FROM golang:1.24.4-alpine3.22


# Update Alpine packages to reduce vulnerabilities
RUN apk update && apk upgrade

# Environment variables which CompileDaemon requires to run
ENV PROJECT_DIR=/app \
  GO111MODULE=on \
  ENV="docker" \
  CGO_ENABLED=0

# Basic setup of the container
RUN mkdir /app
COPY .. /app
WORKDIR /app

# Get CompileDaemon
RUN go get github.com/githubnemo/CompileDaemon
RUN go install github.com/githubnemo/CompileDaemon

# The build flag sets how to build after a change has been detected in the source code
# The command flag sets how to run the app after it has been built
#ENTRYPOINT CompileDaemon -build="go build -o . cmd/api/main.go" -command="./main"

ENTRYPOINT CompileDaemon -build="go build -o . cmd/monolith/main.go" -command="./main"