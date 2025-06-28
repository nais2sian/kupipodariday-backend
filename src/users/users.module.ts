import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Wish } from './../wishes/entities/wish.entity';
import { Wishlist } from './../wishlists/entities/wishlist.entity';
import { Offer } from './../offers/entities/offer.entity';
import { HashModule } from '../hash/hash.module';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wish, Wishlist, Offer]),
    HashModule,
    WishesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
