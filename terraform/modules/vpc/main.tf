resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.main.id
}

## -------  Public Network Configuration  -------

## One public subnet per AZ

resource "aws_subnet" "public" {
  count                   = length(var.public_subnets)
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
    gateway_id = aws_internet_gateway.internet_gateway.id
  }
}

## Associate Route Table with Public Subnets

resource "aws_route_table_association" "public" {
  count          = length(var.public_subnets)
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

## Creates one Elastic IP per AZ (one for each NAT Gateway in each AZ)

resource "aws_eip" "nat_gateway" {
  count  = length(var.private_subnets)
  domain = "vpc"
  tags = {
    Name = "EIP_${count.index}_${var.environment}"
  }

}

## Creates one NAT Gateway per AZ


resource "aws_nat_gateway" "nat_gateway" {
  count         = length(var.private_subnets)
  subnet_id     = aws_subnet.public[count.index].id
  allocation_id = aws_eip.nat_gateway[count.index].id

  tags = {
    Name = "NATGateway_${count.index}_${var.environment}"
  }
}


## One private subnet per AZ

resource "aws_subnet" "private" {
  count             = length(var.private_subnets)
  cidr_block        = var.private_subnets[count.index]
  availability_zone = var.availability_zone_names[count.index]
  vpc_id            = aws_vpc.main.id

  tags = {
    Name = "PrivateSubnet_${count.index}_${var.environment}"
  }
}

## Route to the internet using the NAT Gateway


resource "aws_route_table" "private" {
  count  = length(var.private_subnets)
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gateway[count.index].id
  }

  tags = {
    Name = "PrivateRouteTable_${count.index}_${var.environment}"
  }
}

## Associate Route Table with Private Subnets


resource "aws_route_table_association" "private" {
  count          = length(var.private_subnets)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = element(aws_route_table.private.*.id, count.index)
  depends_on     = [aws_route_table.private, aws_subnet.private]
}
