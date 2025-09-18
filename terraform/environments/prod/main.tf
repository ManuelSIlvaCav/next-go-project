# import vpc module
locals {
  environment  = "prod"
  service_name = "next-go-project"

  availability_zone_names = ["eu-west-1a"]//["eu-west-1a", "eu-west-1b"]
  public_subnets          = ["172.17.0.0/19", "172.17.32.0/19"]
  private_subnets         = ["172.17.96.0/19", "172.17.128.0/19"]
  vpc_cidr                = "172.17.0.0/16"

   // RDS
  postgres_identifier    = "next-go-project-db"
  postgres_port          = 5432
  postgres_db_name       = "petza"

  // ECR existing repo
  ecr_repository_name = "petza"
}

module "secret-manager" {
  source      = "../../modules/secret-manager"
}

module "natgateway-instance" {
  source                  = "../../modules/natgateway-instance"
  environment             = local.environment
  availability_zone_names = local.availability_zone_names
  vpc_main_id             = module.vpc.vpc_id
  public_subnets_ids      = module.vpc.public_subnet_ids
  vpc_cidr = local.vpc_cidr
  private_route_table_ids = module.vpc.private_route_table_ids

  ssh_key_name            = "petza-ssh-key-1"
}

module "natgateway" {
  source                  = "../../modules/natgateway"
  environment             = local.environment
  vpc_main_id             = module.vpc.vpc_id
  public_subnets_ids      = module.vpc.public_subnet_ids
  enable_nat_gateway      = false
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
  
  container_port    = 4000
}

module "security-groups" {
  source                = "../../modules/security-groups"
  environment           = local.environment
  service_name          = local.service_name

  vpc_id                = module.vpc.vpc_id
  alb_security_group_id = module.alb.alb_security_group_id
  container_port        = 4000
}

module "ecr" {
  source              = "../../modules/ecr"
  environment         = local.environment
  service_name        = local.service_name
  ecr_repository_name = local.ecr_repository_name
}

module "rds" {
  source                 = "../../modules/rds"
  environment            = local.environment
  vpc_id                 = module.vpc.vpc_id

  postgres_identifier    = local.postgres_identifier
  postgres_user_name     = module.secret-manager.generated_username
  postgres_db_password   = module.secret-manager.generated_password

  postgres_port          = local.postgres_port
  postgres_db_name       = local.postgres_db_name
  
  private_subnet_ids     = module.vpc.private_subnet_ids
  ecs_sg_id              = module.security-groups.ecs_security_group_id
  bastion_sg_id          = module.natgateway-instance.nat_instance_sg_id
}

module "ecs" {
  source                = "../../modules/ecs"
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids

  alb_security_group_id = module.alb.alb_security_group_id
  alb_target_group_arn  = module.alb.alb_target_group_arn
  ecs_sg_id             = module.security-groups.ecs_security_group_id

  ecr_repository_url    = module.ecr.ecr_repository_url

  container_port        = 4000

  postgres_db_host      = module.rds.postgres_endpoint
  postgres_user_name    = module.secret-manager.generated_username
  postgres_db_password  = module.secret-manager.generated_password
  postgres_db_name      = local.postgres_db_name
  postgres_db_port      = "${local.postgres_port}"

}