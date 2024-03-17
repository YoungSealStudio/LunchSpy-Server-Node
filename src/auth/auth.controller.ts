import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ accessToken: string }> {
    const currentUser = await this.authService.validateUser(
      body.email,
      body.password,
    );
    const accessToken = await this.authService.generateAccessToken(currentUser);

    return {
      accessToken,
    };
  }
}
