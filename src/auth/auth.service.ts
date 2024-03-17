import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/models/User.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException();

    const isRightPassword = await argon2.verify(user.password, password);
    if (!isRightPassword) throw new UnauthorizedException();

    return user;
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = { userId: user.id };

    return this.jwtService.sign(payload);
  }

  async verify(token: string): Promise<User> {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const user = this.userService.findOneById(payload.userId);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
