import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishes: WishesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request): Promise<User> {
    const userId = req.user!.id;
    const user = await this.usersService.findOne({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Req() req: Request, @Body() dto: UpdateProfileDto): Promise<User> {
    return this.usersService.updateOne({ id: req.user!.id }, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  getMyWishes(@Req() req: Request) {
    return this.wishes.find({ owner: { id: req.user!.id } });
  }

  @Get(':username')
  async getPublic(@Param('username') username: string) {
    const user = await this.usersService.findOne({ username });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get(':username/wishes')
  async getPublicWishes(@Param('username') username: string) {
    return this.wishes.find({ owner: { username } });
  }

  @Post('find')
  findByPost(@Body('query') query?: string) {
    if (!query || typeof query !== 'string' || !query.trim()) {
      throw new BadRequestException(
        'В теле запроса нужен непустой строковый "query"',
      );
    }
    return this.usersService.findMany(query.trim());
  }
}
