# import vpc module
locals {
  environment  = "prod"
  service_name = "next-go-project"

  availability_zone_names = ["eu-west-1a", "eu-west-1b"]
  public_subnets          = ["172.17.0.0/19", "172.17.32.0/19"]
  private_subnets         = ["172.17.96.0/19", "172.17.128.0/19"]
  vpc_cidr                = "172.17.0.0/16"

   // RDS
  postgres_identifier    = "next-go-project-db"
  postgres_db_password   = "postgres"
  postgres_user_name     = "postgres"
  postgres_user_password = "postgres"
  postgres_port          = 5432

  // ECR existing repo
  ecr_repository_name = "petza"
}

module "natgateway-instance" {
  source                  = "../../modules/natgateway-instance"
  environment             = local.environment
  availability_zone_names = local.availability_zone_names
  vpc_main_id             = module.vpc.vpc_id
  public_subnets_ids      = module.vpc.public_subnet_ids
  vpc_cidr = local.vpc_cidr
  private_route_table_ids = module.vpc.private_route_table_ids
}

module "natgateway" {
  source                  = "../../modules/natgateway"
  environment             = local.environment
  vpc_main_id             = module.vpc.vpc_id
  public_subnets_ids      = module.vpc.public_subnet_ids
  enable_nat_gateway = false
}

module "vpc" {
  source                  = "../../modules/vpc"
  vpc_cidr                = local.vpc_cidr
  environment             = local.environment
  availability_zone_names = local.availability_zone_names
  public_subnets          = local.public_subnets
  private_subnets         = local.private_subnets

  internet_gateway_id     = module.natgateway.internet_gateway_id
  nat_gateway_ids         = null//module.natgateway.nat_gateway_ids
}

module "alb" {
  source            = "../../modules/alb"
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
}

module "ecr" {
  source              = "../../modules/ecr"
  environment         = local.environment
  service_name        = local.service_name
  ecr_repository_name = local.ecr_repository_name
}

module "ecs" {
  source                = "../../modules/ecs"
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids

  alb_security_group_id = module.alb.alb_security_group_id
  alb_target_group_arn  = module.alb.alb_target_group_arn

  ecr_repository_url    = module.ecr.ecr_repository_url

  depends_on = [ module.alb ]
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