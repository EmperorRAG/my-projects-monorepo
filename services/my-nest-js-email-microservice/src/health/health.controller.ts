import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Health check endpoint',
    description:
      'Performs a health check by pinging external dependencies and returning the overall service health status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy and all dependencies are reachable.',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
        info: {
          type: 'object',
          example: {
            'nestjs-docs': {
              status: 'up',
            },
          },
        },
        error: {
          type: 'object',
          example: {},
        },
        details: {
          type: 'object',
          example: {
            'nestjs-docs': {
              status: 'up',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Service is unhealthy or dependencies are unreachable.',
  })
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
