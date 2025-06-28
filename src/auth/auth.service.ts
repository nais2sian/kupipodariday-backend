import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { QueryFailedError } from 'typeorm';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

import { HashService } from '../hash/hash.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly hash: HashService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const { password, ...rest } = dto;
    const hash = await this.hash.hash(password);

    try {
      const user = await this.users.create({ ...rest, password: hash });
      return this.login(user);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        err.driverError?.code === '23505'
      ) {
        throw new ConflictException('email или username уже заняты');
      }
      throw err;
    }
  }

  async validate(username: string, password: string) {
    const user = await this.users.findOne({ username });
    if (!user || !(await this.hash.compare(password, user.password))) {
      throw new UnauthorizedException();
    }
    return user;
  }

  login(user: User) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwt.sign(payload),
      user: { id: user.id, username: user.username, email: user.email },
    };
  }
}
