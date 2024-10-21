# import vpc module
locals {
  environment  = "prod-simple"
  service_name = "next-go-project"
}


module "ecr" {
  source      = "../../modules/ecr"
  environment = local.environment
  service_name = local.service_name
}

module "apprunner" {
  source      = "../../modules/apprunner"
  environment = local.environment
  service_name = local.service_name
  ecr_repository_url = module.ecr.ecr_repository_url
}