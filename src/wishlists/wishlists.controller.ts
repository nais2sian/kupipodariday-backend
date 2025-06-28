import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlists: WishlistsService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateWishlistDto) {
    return this.wishlists.createFor(req.user!.id, dto);
  }

  @Get()
  find(@Query() query: Record<string, unknown>) {
    return this.wishlists.findWithRelations(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishlists.findOneWithRelations(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() dto: UpdateWishlistDto,
  ) {
    return this.wishlists.updateSafely(id, req.user!.id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.wishlists.removeSafely(id, req.user!.id);
  }
}
