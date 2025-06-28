import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { WishesModule } from '../wishes/wishes.module';
import { AppMailModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer, Wish, User]),
    forwardRef(() => WishesModule),
    AppMailModule,
  ],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService],
})
export class OffersModule {}
