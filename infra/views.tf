resource "aws_dynamodb_table" "views" {
  name         = "${replace(var.domain, ".", "-")}-views"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "slug"

  attribute {
    name = "slug"
    type = "S"
  }
}

data "archive_file" "views_lambda" {
  type        = "zip"
  source_file = "${path.module}/lambda/views.mjs"
  output_path = "${path.module}/build/views.zip"
}

data "aws_iam_policy_document" "views_lambda_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "views_lambda" {
  name               = "${replace(var.domain, ".", "-")}-views-lambda"
  assume_role_policy = data.aws_iam_policy_document.views_lambda_assume.json
}

data "aws_iam_policy_document" "views_lambda" {
  statement {
    sid       = "TableAccess"
    effect    = "Allow"
    actions   = ["dynamodb:UpdateItem", "dynamodb:GetItem"]
    resources = [aws_dynamodb_table.views.arn]
  }

  statement {
    sid    = "Logs"
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_role_policy" "views_lambda" {
  name   = "views"
  role   = aws_iam_role.views_lambda.id
  policy = data.aws_iam_policy_document.views_lambda.json
}

resource "aws_lambda_function" "views" {
  function_name    = "${replace(var.domain, ".", "-")}-views"
  role             = aws_iam_role.views_lambda.arn
  handler          = "views.handler"
  runtime          = "nodejs22.x"
  timeout          = 5
  memory_size      = 128
  filename         = data.archive_file.views_lambda.output_path
  source_code_hash = data.archive_file.views_lambda.output_base64sha256

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.views.name
    }
  }
}

resource "aws_lambda_function_url" "views" {
  function_name      = aws_lambda_function.views.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_origins     = ["https://${var.domain}", "https://www.${var.domain}"]
    allow_methods     = ["GET", "POST"]
    allow_headers     = ["content-type"]
    max_age           = 86400
  }
}

resource "aws_lambda_permission" "views_public_url" {
  statement_id           = "AllowPublicFunctionUrlInvoke"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.views.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}
