resource "aws_security_group" "rds_security_group" {
  vpc_id = var.vpc_id

  ingress {
    protocol        = "tcp"
    from_port       = 5432
    to_port         = 5432
    cidr_blocks     = ["0.0.0.0/0"]
    security_groups = flatten([var.ecs_sg_id != null ? [var.ecs_sg_id] : []])
  }

  egress {
    protocol    = "tcp"
    from_port   = 0
    to_port     = 65535
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_subnet_group" "rds" {
  name        = "private-subnet-group"
  description = "Private Subnet Group"
  subnet_ids  = var.private_subnet_ids
}

resource "aws_db_parameter_group" "postgres" {
  name        = "default-postgres16"
  family      = "postgres16"
  description = "Custom Parameter Group for Postgres 16"
  parameter {
    name         = "shared_preload_libraries"
    value        = "pg_stat_statements"
    apply_method = "pending-reboot"
  }
  parameter {
    name         = "log_statement"
    value        = "all"
    apply_method = "pending-reboot"
  }

}

resource "aws_db_instance" "postgres_db" {
  identifier = var.postgres_identifier

  allocated_storage = 5
  storage_type      = "gp2"
  engine            = "postgres"
  engine_version    = "16.3"
  instance_class    = "db.t3.micro"

  username = var.postgres_user_name
  password = var.postgres_db_password
  port     = var.postgres_port

  publicly_accessible  = true
  parameter_group_name = aws_db_parameter_group.postgres.name
  skip_final_snapshot  = true

  db_subnet_group_name = aws_db_subnet_group.rds.id

  vpc_security_group_ids = [aws_security_group.rds_security_group.id]
}
