import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { BaseCrudService } from '../common/services/base-crud.service';
import { AppMailService } from './../mailer/mailer.service';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService extends BaseCrudService<Offer> {
  constructor(
    @InjectRepository(Offer) repo: Repository<Offer>,
    @InjectRepository(Wish) private readonly wishesRepo: Repository<Wish>, // ← есть
    private readonly dataSource: DataSource,
    private readonly mail: AppMailService,
  ) {
    super(repo);
  }

  countByWish(itemId: number) {
    return this.repo.count({ where: { item: { id: itemId } } });
  }

  override findOne(where: { id: number }): Promise<Offer | null> {
    return this.repo.findOne({
      where,
      relations: { user: true },
    });
  }

  async createFor(userId: number, dto: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishesRepo.findOne({
      where: { id: dto.itemId },
      relations: { owner: true },
    });

    if (!wish) throw new NotFoundException('Wish not found');
    if (wish.owner.id === userId)
      throw new ForbiddenException('Нельзя скидываться на собственный подарок');
    const rest = Number(wish.price) - Number(wish.raised);
    if (dto.amount > rest)
      throw new BadRequestException(
        `Слишком много: можно внести максимум ${rest}`,
      );

    const savedOffer: Offer = await this.dataSource.transaction(async (tm) => {
      const offerRepo = tm.getRepository(Offer);
      const wishRepo = tm.getRepository(Wish);

      const offer = offerRepo.create({
        amount: dto.amount,
        hidden: dto.hidden ?? false,
        user: { id: userId },
        item: { id: wish.id },
      });

      const result = await offerRepo.save(offer);
      await wishRepo.increment({ id: wish.id }, 'raised', dto.amount);

      return result;
    });

    return savedOffer;
  }

  override updateOne(): Promise<never> {
    throw new ForbiddenException('Offers are immutable');
  }
  override removeOne(): Promise<never> {
    throw new ForbiddenException('Offers are immutable');
  }
}
