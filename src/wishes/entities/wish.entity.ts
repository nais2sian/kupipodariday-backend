import { Entity, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column({ length: 250 })
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  raised: number;

  @Column({ length: 1024 })
  description: string;

  @Column('int', { default: 0 })
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes, { eager: false })
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wl) => wl.items)
  wishlists: Wishlist[];
}
