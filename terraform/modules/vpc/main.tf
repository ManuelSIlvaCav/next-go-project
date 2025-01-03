resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "MainVPC_${var.environment}"
  }
}

## -------  Public Network Configuration  -------

## One public subnet per AZ

resource "aws_subnet" "public" {
  count                   = length(var.availability_zone_names)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnets[count.index]
  availability_zone       = var.availability_zone_names[count.index]
  map_public_ip_on_launch = true
  tags = {
    Name = "PublicSubnet_${count.index}_${var.environment}"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = var.internet_gateway_id != null ? var.internet_gateway_id : null
  }
  tags = {
    Name = "PublicRouteTable_${var.environment}"
  }
}

## Associate Route Table with Public Subnets

resource "aws_route_table_association" "public" {
  count          = length(var.availability_zone_names)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
  depends_on     = [aws_route_table.public, aws_subnet.public]
}

## Make our Route Table the main Route Table

resource "aws_main_route_table_association" "public_main" {
  vpc_id         = aws_vpc.main.id
  route_table_id = aws_route_table.public.id
}


## -------  Private Network Configuration  -------

## One private subnet per AZ

resource "aws_subnet" "private" {
  count             = length(var.availability_zone_names)
  cidr_block        = var.private_subnets[count.index]
  availability_zone = var.availability_zone_names[count.index]
  vpc_id            = aws_vpc.main.id


  tags = {
    Name = "PrivateSubnet_${count.index}_${var.environment}"
  }
}

## Route to the internet using the NAT Gateway


resource "aws_route_table" "private" {
  count  = length(var.availability_zone_names)
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = var.nat_gateway_ids != null ? var.nat_gateway_ids[0] : null /* var.nat_gateway_ids != null ? var.nat_gateway_ids[count.index] : null */ //We will use only 1 NAT gateway
  }

  tags = {
    Name = "PrivateRouteTable_${count.index}_${var.environment}"
  }
}

## Associate Route Table with Private Subnets


resource "aws_route_table_association" "private" {
  count          = length(var.availability_zone_names)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = element(aws_route_table.private.*.id, count.index)
  depends_on     = [aws_route_table.private, aws_subnet.private]
}
