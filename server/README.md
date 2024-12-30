## Execute single container

> docker build -f Dockerfile -t server-go .

> docker run -p 127.0.0.1:8080:8080 server-go

## Migration

1. To create migrations

> migrate create -ext sql -dir db/migrations -seq create_users_table

Example from root folder

> migrate create -ext sql -dir server/cmd/jobs/migration_controller/migrations -seq email_templates_create

2. To run migrations

Manualy

> migrate -database YOUR_DATABASE_URL -path PATH_TO_YOUR_MIGRATIONS up

But it should be handled by the docker image with jobs and migrations

# Libraries

- Uber FX for dependency injection
- SQLX for postgres driver and sql queries/models
- Echo for simple framework to develop web apps
- Koanf for env variable handling
- migrate v4 for hadling SQL migration https://github.com/golang-migrate/migrate
- asyncq for jobs scheduling https://github.com/hibiken/asynq?tab=readme-ov-file

## Interesting Findings

Processing 10k rows csv

- No concurrency 55sec
- with go routines, buffer channel and batch insert 1.3sec
