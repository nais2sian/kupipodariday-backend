import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offers: OffersService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateOfferDto) {
    return this.offers.createFor(req.user!.id, dto);
  }

  @Get()
  find(@Query() q: Record<string, unknown>) {
    return this.offers.find(q);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const offer = await this.offers.findOne({ id });

    if (!offer) return null;

    const isOwner = offer.user.id === req.user!.id;

    if (offer.hidden && !isOwner) {
      throw new ForbiddenException('Offer is hidden');
    }

    return offer;
  }
}
