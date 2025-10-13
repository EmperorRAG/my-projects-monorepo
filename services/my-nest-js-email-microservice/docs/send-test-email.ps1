# Load .env file from service root
# .env is at: services/my-nest-js-email-microservice/.env
# Script is called from workspace root
$envFile = "services\my-nest-js-email-microservice\.env"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
      $key = $matches[1]
      $value = $matches[2]
      [System.Environment]::SetEnvironmentVariable($key, $value)
    }
  }
}

# Send email using API_KEY from environment
$headers = @{
  "Authorization" = "Bearer $env:API_KEY"
  "Content-Type"  = "application/json"
}

$body = @{
  to      = "recipient@example.com"
  subject = "Test Email"
  body    = "This is a test email"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/email/send" -Method Post -Headers $headers -Body $body
