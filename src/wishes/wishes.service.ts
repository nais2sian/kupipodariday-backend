import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { OffersService } from '../offers/offers.service';
import { BaseCrudService } from '../common/services/base-crud.service';

import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService extends BaseCrudService<Wish> {
  constructor(
    @InjectRepository(Wish) repo: Repository<Wish>,
    private readonly offers: OffersService,
  ) {
    super(repo);
  }

  createFor(userId: number, dto: CreateWishDto) {
    return this.create({ ...dto, owner: { id: userId } });
  }

  findLast(limit = 40) {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['owner'],
    });
  }

  findTop(limit = 40) {
    return this.repo.find({
      order: { copied: 'DESC' },
      take: limit,
      relations: ['owner'],
    });
  }

  async copy(wishId: number, newOwnerId: number) {
    const original = await this.repo.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });
    if (!original) throw new NotFoundException('Wish not found');
    const data: Partial<Wish> = { ...original };

    delete data.id;
    delete data.owner;
    delete data.raised;
    delete data.copied;
    delete data.createdAt;
    delete data.updatedAt;

    const clone = this.repo.create({
      ...data,
      owner: { id: newOwnerId },
      raised: 0,
      copied: 0,
    });
    const savedClone = await this.repo.save(clone); // → INSERT
    await this.repo.increment({ id: wishId }, 'copied', 1);

    return savedClone;
  }

  async updateSafely(wishId: number, userId: number, dto: UpdateWishDto) {
    const wish = await this.repo.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });
    if (!wish) throw new NotFoundException('Wish not found');
    if (wish.owner.id !== userId)
      throw new ForbiddenException('You can edit only your wishes');
    const hasOffers = await this.offers.countByWish(wishId);

    if (hasOffers && dto.price && dto.price !== wish.price)
      throw new BadRequestException('Price locked: someone already pledged');

    if ('raised' in dto)
      throw new BadRequestException('Field "raised" is readonly');

    return this.updateOne({ id: wishId }, dto);
  }

  async removeSafely(wishId: number, userId: number) {
    const wish = await this.repo.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });
    if (!wish) throw new NotFoundException('Wish not found');

    if (wish.owner.id !== userId)
      throw new ForbiddenException('You can delete only your wishes');

    return this.removeOne({ id: wishId });
  }

  override findOne(where: FindOptionsWhere<Wish>): Promise<Wish | null> {
    return this.repo.findOne({
      where,
      relations: { owner: true },
    });
  }

  addRaised(id: number, delta: number) {
    return this.repo.increment({ id }, 'raised', delta);
  }
}
