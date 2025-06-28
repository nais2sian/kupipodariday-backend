import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { Request } from 'express';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishes: WishesService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateWishDto) {
    return this.wishes.createFor(req.user!.id, dto);
  }

  @Get('last')
  findLast() {
    return this.wishes.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishes.findTop();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishes.findOne({ id });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() dto: UpdateWishDto,
  ) {
    return this.wishes.updateSafely(id, req.user!.id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.wishes.removeSafely(id, req.user!.id);
  }

  @Post(':id/copy')
  copy(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.wishes.copy(id, req.user!.id);
  }
}
