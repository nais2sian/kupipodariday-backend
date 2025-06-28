import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';

import { Wishlist } from './entities/wishlist.entity';
import { Wish } from './../wishes/entities/wish.entity';
import { User } from './../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Wish, User])],
  controllers: [WishlistsController],
  providers: [WishlistsService],
  exports: [WishlistsService],
})
export class WishlistsModule {}
