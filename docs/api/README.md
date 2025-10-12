# API Documentation

API documentation and contracts for services in the monorepo.

## Overview

This directory contains API documentation, contracts, and specifications for all services and applications that expose APIs.

## API Categories

### REST APIs

RESTful API documentation for HTTP-based services.

#### Available APIs

- **Email Service API** _(planned)_
  - Send email endpoint
  - Email status endpoint
  - Health check endpoint

- **Main Application API** _(planned)_
  - API routes from Next.js
  - Server actions
  - Data fetching

### GraphQL APIs

_(Planned)_ GraphQL schema and API documentation.

### Internal APIs

Service-to-service communication contracts.

## API Documentation Structure

Each API should have documentation covering:

### 1. Overview
- API purpose and scope
- Base URL
- Authentication requirements
- Rate limiting

### 2. Endpoints

For each endpoint document:
- Method (GET, POST, PUT, DELETE, etc.)
- Path
- Request parameters
- Request body schema
- Response schema
- Status codes
- Examples

### 3. Authentication

- Authentication methods
- Token formats
- Security requirements
- Example authentication flow

### 4. Error Handling

- Error response format
- Common error codes
- Error messages
- Troubleshooting guide

### 5. Examples

- cURL examples
- Code examples (TypeScript/JavaScript)
- Response examples

## REST API Template

```markdown
# [Service Name] API

## Base URL

\`\`\`
Development: http://localhost:3000/api
Production: https://api.example.com
\`\`\`

## Authentication

All endpoints require authentication using Bearer tokens:

\`\`\`http
Authorization: Bearer <token>
\`\`\`

## Endpoints

### POST /endpoint

Description of what this endpoint does.

**Request**

\`\`\`http
POST /api/endpoint
Content-Type: application/json
Authorization: Bearer <token>

{
  "field": "value"
}
\`\`\`

**Response**

\`\`\`http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "123",
  "status": "success"
}
\`\`\`

**Status Codes**

- \`200 OK\`: Success
- \`400 Bad Request\`: Invalid input
- \`401 Unauthorized\`: Missing or invalid token
- \`500 Internal Server Error\`: Server error

**Example (cURL)**

\`\`\`bash
curl -X POST https://api.example.com/endpoint \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'
\`\`\`

**Example (TypeScript)**

\`\`\`typescript
const response = await fetch('https://api.example.com/endpoint', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ field: 'value' })
});

const data = await response.json();
\`\`\`
```

## API Standards

### RESTful Conventions

- Use proper HTTP methods
- Use plural nouns for resources
- Use kebab-case for URLs
- Version APIs appropriately
- Return proper status codes

### Request/Response Format

- Use JSON for data exchange
- Include Content-Type headers
- Use ISO 8601 for dates
- Use camelCase for JSON keys
- Include pagination for lists

### Error Responses

Standard error format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [
      {
        "field": "fieldName",
        "issue": "validation error"
      }
    ]
  }
}
```

### Authentication

Supported methods:
- Bearer tokens (JWT)
- API keys _(planned)_
- OAuth 2.0 _(planned)_

### Versioning

API versioning strategy:
- URL path versioning: `/api/v1/resource`
- Header versioning _(alternative)_
- Deprecation policy

## API Testing

### Tools

- **Postman**: Interactive API testing
- **cURL**: Command-line testing
- **Playwright**: E2E API testing
- **Jest**: Unit testing API clients

### Testing Checklist

- [ ] All endpoints tested
- [ ] Authentication tested
- [ ] Error cases tested
- [ ] Rate limiting tested
- [ ] Performance tested
- [ ] Security tested

## OpenAPI/Swagger

_(Planned)_ OpenAPI specification for API documentation.

Benefits:
- Auto-generated documentation
- Client SDK generation
- API validation
- Interactive testing

## API Client Libraries

### TypeScript/JavaScript

```typescript
// Example API client
import { ApiClient } from '@my-org/api-client';

const client = new ApiClient({
  baseUrl: 'https://api.example.com',
  apiKey: process.env.API_KEY
});

const result = await client.endpoint.action(params);
```

### Best Practices

✅ **Do**:
- Use typed API clients
- Handle errors gracefully
- Implement retry logic
- Cache when appropriate
- Log API calls

❌ **Don't**:
- Hardcode URLs
- Ignore error handling
- Skip authentication
- Leak sensitive data
- Block on API calls

## Service Contracts

### Internal Service Communication

For service-to-service APIs:

1. **Define Contract**: Create interface
2. **Version Contract**: Use semantic versioning
3. **Document Contract**: Include examples
4. **Test Contract**: Contract testing
5. **Monitor Contract**: Track breaking changes

### Contract Testing

Tools:
- Pact _(planned)_: Contract testing
- JSON Schema: Schema validation

## Rate Limiting

### Limits

- **Anonymous**: 100 requests/hour
- **Authenticated**: 1000 requests/hour
- **Premium**: 10000 requests/hour

### Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1625097600
```

### Handling Rate Limits

```typescript
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  // Wait and retry
}
```

## Security

### HTTPS Only

All API communication must use HTTPS in production.

### Input Validation

- Validate all inputs
- Sanitize user data
- Use schema validation
- Prevent injection attacks

### Authentication & Authorization

- Verify all requests
- Check permissions
- Use secure tokens
- Implement RBAC _(planned)_

### CORS

Configure CORS appropriately:

```typescript
{
  origin: ['https://app.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}
```

## Monitoring

### API Metrics

Track:
- Request rate
- Response time
- Error rate
- Success rate
- Payload size

### Logging

Log:
- Request details (method, path, params)
- Response status
- Response time
- User context
- Errors and exceptions

### Alerting

Alert on:
- High error rates
- Slow response times
- Rate limit violations
- Authentication failures

## Documentation Maintenance

### Regular Updates

- Update after API changes
- Add new endpoints
- Mark deprecated endpoints
- Update examples
- Refresh status codes

### Versioning Documentation

- Document each API version
- Maintain migration guides
- Track breaking changes
- Archive old versions

## Related Documentation

- [Architecture Overview](../architecture/overview.md)
- [Service Documentation](../../services/)
- [Runbooks](../runbooks/)
- [Security Guide](../guides/) _(planned)_

## Contributing

To add API documentation:

1. Follow the API template above
2. Include all required sections
3. Provide working examples
4. Test all examples
5. Update this README
6. Cross-reference related docs

---

**Note**: This is a living document. Update it as APIs evolve.
