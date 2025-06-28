import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.auth.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Request() req) {
    return this.auth.login(req.user as User);
  }
}
