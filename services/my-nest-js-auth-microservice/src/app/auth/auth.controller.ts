import { Controller, All, Req, Res } from '@nestjs/common';
import { auth } from '../../lib/auth';

@Controller('api/auth')
export class AuthController {
  /**
   * Catch-all route to handle all Better Auth requests
   * Better Auth uses a single handler for all authentication routes
   */
  @All('*')
  async handleAuth(@Req() req: any, @Res() res: any) {
    // Better Auth handler processes the request and sends the response
    // The handler returns a Response object
    const response = await auth.handler(req);

    // Send the response back
    res.status(response.status).set(response.headers).send(response.body);
  }
}
