output "s3_bucket" {
  description = "Name of the S3 bucket holding the site"
  value       = aws_s3_bucket.site.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — used by GitHub Actions for invalidation"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain" {
  description = "CloudFront default domain"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "github_deploy_role_arn" {
  description = "IAM role ARN used by GitHub Actions via OIDC"
  value       = aws_iam_role.github_deploy.arn
}

output "site_url" {
  value = "https://${var.domain}"
}
