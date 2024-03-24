import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  private client;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.client = new OAuth2Client({
      clientId: configService.get('OAUTH_GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('OAUTH_GOOGLE_SECRET'),
      redirectUri: configService.get('OAUTH_GOOGLE_CALLBACK'),
    });
  }

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/login')
  async googleAuthCallback(
    @Req() req: Request,
    @Query('code') code: string,
  ): Promise<{ accessToken: string }> {
    const { tokens } = await this.client.getToken(code);
    const {
      payload,
    }: { payload: { sub: string; email: string; name: string } } =
      await this.client.verifyIdToken({
        idToken: tokens.id_token,
      });
    const upsertedUser = await this.authService.validateGoogleUser(
      payload.sub,
      payload.email,
    );

    const accessToken =
      await this.authService.generateAccessToken(upsertedUser);

    return {
      accessToken,
    };
  }
}
