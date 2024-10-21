# import vpc module
locals {
  environment  = "prod"
  service_name = "next-go-project"
}

module "vpc" {
  source      = "../../modules/vpc"
  vpc_cidr    = "172.17.0.0/16"
  environment = local.environment
}

module "alb" {
  source            = "../../modules/alb"
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
}

module "ecr" {
  source      = "../../modules/ecr"
  environment = local.environment
  service_name = local.service_name
}


module "ecs" {
  source                = "../../modules/ecs"
  vpc_id                = module.vpc.vpc_id
  alb_security_group_id = module.alb.alb_security_group_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  alb_target_group_arn  = module.alb.alb_target_group_arn
}


