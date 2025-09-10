## Application Load Balancer in public subnets with HTTP default listener that redirects traffic to HTTPS
resource "aws_alb" "alb" {
  name            = "${var.service_name}-ALB-${var.environment}"
  security_groups = [aws_security_group.alb.id]
  subnets         = var.public_subnet_ids
  tags = {
    Terraform   = "true"
  }
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
  tags = {
    Terraform   = "true"
  }
}

## SG for ALB

resource "aws_security_group" "alb" {
  name        = "${var.service_name}_alb_sg_${var.environment}"
  description = "Security group for ALB"
  vpc_id      = var.vpc_id
  revoke_rules_on_delete      = true
  tags = {
    Terraform   = "true"
  }

  egress {
    description = "Allow all egress traffic"
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
    self        = true
  }

  ingress {
    from_port                   = 443
    to_port                     = 443
    protocol                    = "TCP"
    description                 = "Allow https inbound traffic from internet"
    cidr_blocks                 = ["0.0.0.0/0"]
    self                        = true
  }

  ingress {
    from_port                   = 80
    to_port                     = 80
    protocol                    = "TCP"
    description                 = "Allow http inbound traffic from internet"
    cidr_blocks                 = ["0.0.0.0/0"]
    self                        = true
  }

}

#Defines an HTTP Listener for the ALB
resource "aws_lb_listener" "listener" {
  load_balancer_arn         = aws_alb.alb.arn
  port                      = "80"
  protocol                  = "HTTP"

  default_action {
    type                    = "forward"
    target_group_arn        = aws_alb_target_group.service_target_group.arn
  }
}