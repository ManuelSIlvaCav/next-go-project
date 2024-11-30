## Creates one Elastic IP per AZ (one for each NAT Gateway in each AZ)

resource "aws_eip" "nat_gateway" {
  count  = length(var.availability_zone_names)
  domain = "vpc"
  tags = {
    Name = "EIP_${count.index}_${var.environment}"
  }

}

## Creates one NAT Gateway per AZ

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = var.vpc_main_id
}

resource "aws_nat_gateway" "nat_gateway" {
  count         = length(var.availability_zone_names)
  subnet_id     = var.public_subnets_ids[count.index] //aws_subnet.public[count.index].id
  allocation_id = aws_eip.nat_gateway[count.index].id

  tags = {
    Name = "NATGateway_${count.index}_${var.environment}"
  }
}