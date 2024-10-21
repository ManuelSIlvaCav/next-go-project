## Application Load Balancer in public subnets with HTTP default listener that redirects traffic to HTTPS
resource "aws_alb" "alb" {
  name            = "${var.service_name}-ALB-${var.environment}"
  security_groups = [aws_security_group.alb.id]
  subnets         = var.public_subnet_ids //aws_subnet.public.*.id
}

## Creates the Target Group for our service

resource "aws_alb_target_group" "service_target_group" {
  name                 = "${var.service_name}-TargetGroup-${var.environment}"
  port                 = var.container_port
  protocol             = "HTTP"
  vpc_id               = var.vpc_id
  deregistration_delay = 5
  target_type          = "ip"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    interval            = 60
    matcher             = var.healthcheck_matcher
    path                = var.healthcheck_endpoint
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 30
  }

  depends_on = [aws_alb.alb]
}

## SG for ALB

resource "aws_security_group" "alb" {
  name        = "${var.service_name}_ALB_SecurityGroup_${var.environment}"
  description = "Security group for ALB"
  vpc_id      = var.vpc_id

  egress {
    description = "Allow all egress traffic"
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

}
