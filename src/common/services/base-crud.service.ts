import {
  Repository,
  ObjectLiteral,
  DeepPartial,
  FindOptionsWhere,
  FindManyOptions,
} from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BaseCrudService<T extends ObjectLiteral> {
  constructor(protected readonly repo: Repository<T>) {}

  create(payload: DeepPartial<T>) {
    const entity = this.repo.create(payload);
    return this.repo.save(entity);
  }

  findOne(where: FindOptionsWhere<T>) {
    return this.repo.findOne({ where });
  }

  find(
    where: FindOptionsWhere<T>,
    opts: Omit<FindManyOptions<T>, 'where'> = {},
  ) {
    return this.repo.find({ where, ...opts });
  }

  async updateOne(
    where: FindOptionsWhere<T>,
    payload: DeepPartial<T>,
  ): Promise<T> {
    const entity = await this.repo.findOne({ where });
    if (!entity) throw new NotFoundException();

    const merged = this.repo.merge(entity, payload);

    return this.repo.save(merged);
  }

  async removeOne(where: FindOptionsWhere<T>) {
    const entity = await this.findOne(where);
    if (!entity) throw new NotFoundException();
    return this.repo.remove(entity);
  }
}
