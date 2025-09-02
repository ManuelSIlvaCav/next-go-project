# Runnning the project

## With docker-compose

> docker-compose build
> docker-compose up

## Infracost

Infracost is a service that allows to calculate approximately the cost of the infrastructure being deployed with terraform. ex

> infracost breakdown --show-skipped --path .

## Terraform configs

Prod-simple env is a simple deployment with app runners exposed for easy testing and for product start

Prod is a more scalable solution with ecs deployments with a load balancer when transitioning is a simple way to evolve the platform

## Setup different terraform users

Read the values of the aws credential file

> nano ~/.aws/credentials

To set a different user

> export AWS_PROFILE=oikoflow-integration-user

# ToDo 
- Add infrastructure with appunner, dbs and aws