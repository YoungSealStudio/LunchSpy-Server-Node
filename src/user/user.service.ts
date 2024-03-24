import { Injectable } from '@nestjs/common';
import { User } from './models/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByGoogleId(id: string): Promise<User> {
    return this.userRepository.findOneBy({ googleId: id });
  }

  async create(dto: { email: string; password: string }): Promise<User> {
    const isEmailExist = await this.userRepository.exists({
      where: { email: dto.email },
    });
    if (isEmailExist) throw new BadRequestException();

    dto.password = await argon2.hash(dto.password);
    return this.userRepository.save(dto);
  }

  async createGoogleUser(googleId: string, email: string): Promise<User> {
    return this.userRepository.save({ email, googleId });
  }
}
