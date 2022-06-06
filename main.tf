terraform {
  required_providers {
	aws = {
	  source = "hashicorp/aws"
	}
  }
}

provider "aws" {
  profile = "default"
  region  = "eu-central-1"
}

resource "aws_instance" "link_shortener_server" {
  ami           = "ami-09439f09c55136ecf"
  instance_type = "t2.micro"

  tags = {
	Name = "LinkShortenerServerInstance"
  }
}

resource "aws_security_group" "security_link_shortener_server" {
  name        = "security_link_shortener_server"
  description = "security group for link shortener server"

  ingress {
	protocol    = "tcp"
	from_port   = "80"
	to_port     = "80"
	cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
	protocol    = "tcp"
	from_port   = "443"
	to_port     = "443"
	cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
	protocol    = "tcp"
	from_port   = 22
	to_port     = 22
	cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
	protocol    = "tcp"
	from_port   = "80"
	to_port     = "80"
	cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
	protocol    = "tcp"
	from_port   = 443
	to_port     = 443
	cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
	Name = "security_link_shortener_server"
  }
}
