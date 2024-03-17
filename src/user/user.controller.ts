import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() body: { email: string; password: string },
  ): Promise<unknown> {
    const createdUser = await this.userService.create(body);

    return createdUser;
  }
}
