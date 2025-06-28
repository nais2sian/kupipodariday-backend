import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column({ length: 250 })
  name: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.wishlists, { cascade: true })
  @JoinTable()
  items: Wish[];
}
