# import vpc module
locals {
  environment             = "prod-simple"
  service_name            = "next-go-project"
  availability_zone_names = ["eu-west-1a", "eu-west-1b"]
  public_subnets          = ["172.17.0.0/19", "172.17.32.0/19"]
  private_subnets         = ["172.17.96.0/19", "172.17.128.0/19"]

  // RDS
  postgres_identifier    = "next-go-project-db"
  postgres_db_password   = "postgres"
  postgres_user_name     = "postgres"
  postgres_user_password = "postgres"
  postgres_port          = 5432

  // ECR existing repo
  ecr_repository_name = "project_x_demo"
}


module "ecr" {
  source              = "../../modules/ecr"
  environment         = local.environment
  service_name        = local.service_name
  ecr_repository_name = local.service_name
}

module "natgateway" {
  source                  = "../../modules/natgateway"
  environment             = local.environment
  availability_zone_names = ["eu-west-1a"]
  vpc_main_id             = module.vpc.vpc_id
  public_subnets_ids      = module.vpc.public_subnet_ids
}

module "vpc" {
  source                  = "../../modules/vpc"
  vpc_cidr                = "172.17.0.0/16"
  environment             = local.environment
  availability_zone_names = local.availability_zone_names
  public_subnets          = local.public_subnets
  private_subnets         = local.private_subnets
  internet_gateway_id     = module.natgateway.internet_gateway_id
  nat_gateway_ids         = module.natgateway.nat_gateway_ids
}

module "rds" {
  source                 = "../../modules/rds"
  environment            = local.environment
  vpc_id                 = module.vpc.vpc_id
  postgres_identifier    = local.postgres_identifier
  postgres_user_name     = local.postgres_user_name
  postgres_user_password = local.postgres_user_password
  postgres_db_password   = local.postgres_db_password
  postgres_port          = local.postgres_port
  private_subnet_ids     = module.vpc.private_subnet_ids
}

module "apprunner" {
  source             = "../../modules/apprunner"
  environment        = local.environment
  service_name       = local.service_name
  ecr_repository_url = module.ecr.ecr_repository_url
  //module.ecr.ecr_repository_url
}

