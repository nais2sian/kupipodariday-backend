import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, FindManyOptions } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { BaseCrudService } from '../common/services/base-crud.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService extends BaseCrudService<Wishlist> {
  constructor(
    @InjectRepository(Wishlist) repo: Repository<Wishlist>,
    @InjectRepository(Wish) private readonly wishes: Repository<Wish>,
  ) {
    super(repo);
  }

  findWithRelations(where: Record<string, unknown> = {}) {
    const opts: FindManyOptions<Wishlist> = {
      where,
      relations: ['owner', 'items', 'items.owner'],
      order: { createdAt: 'DESC' },
    };
    return this.repo.find(opts);
  }

  findOneWithRelations(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['owner', 'items', 'items.owner'],
    });
  }

  async createFor(ownerId: number, dto: CreateWishlistDto) {
    let wishEntities: Wish[] = [];
    if (dto.itemsId?.length) {
      wishEntities = await this.wishes.find({ where: { id: In(dto.itemsId) } });

      if (wishEntities.length !== dto.itemsId.length) {
        throw new BadRequestException('One or more wishes not found');
      }
    }

    return this.create({
      name: dto.name,
      image: dto.image,
      owner: { id: ownerId },
      items: wishEntities,
    });
  }

  async updateSafely(id: number, ownerId: number, dto: UpdateWishlistDto) {
    const list = await this.findOne({ id });
    if (!list) throw new NotFoundException('Wishlist not found');

    if (list.owner.id !== ownerId) {
      throw new ForbiddenException('You can edit only your wishlists');
    }

    return this.updateOne({ id }, dto);
  }

  async removeSafely(id: number, ownerId: number) {
    const list = await this.repo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!list) throw new NotFoundException();

    if (list.owner.id !== ownerId)
      throw new ForbiddenException('You can delete only your wishlists');

    return this.removeOne({ id });
  }
}
