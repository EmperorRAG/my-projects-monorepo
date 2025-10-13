#!/bin/bash

# Load environment variables from .env file in service root
# .env is at: services/my-nest-js-email-microservice/.env
if [ -f "services/my-nest-js-email-microservice/.env" ]; then
  export $(grep -v '^#' services/my-nest-js-email-microservice/.env | xargs)
fi

# Send email using API_KEY from environment
curl -X POST http://localhost:3000/api/email/send \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "body": "This is a test email"
  }'
