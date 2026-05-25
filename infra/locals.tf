locals {
  bucket_name     = "${replace(var.domain, ".", "-")}-site"
  www_domain      = "www.${var.domain}"
  alternate_names = [var.domain, local.www_domain]
}

data "aws_route53_zone" "primary" {
  name         = "${var.domain}."
  private_zone = false
}
