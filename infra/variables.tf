variable "domain" {
  description = "Apex domain (without www)"
  type        = string
  default     = "develicit.com"
}

variable "region" {
  description = "Primary AWS region (S3 bucket location)"
  type        = string
  default     = "ap-northeast-2"
}

variable "github_repo" {
  description = "GitHub repo in owner/name form, used for OIDC trust"
  type        = string
  default     = "Jeon1691/blog"
}

variable "price_class" {
  description = "CloudFront price class. PriceClass_200 includes US/EU/Asia."
  type        = string
  default     = "PriceClass_200"
}
