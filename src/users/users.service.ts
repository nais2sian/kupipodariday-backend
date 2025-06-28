import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, FindOptionsWhere, QueryFailedError } from 'typeorm';
import { User } from './entities/user.entity';
import { BaseCrudService } from '../common/services/base-crud.service';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService extends BaseCrudService<User> {
  constructor(
    @InjectRepository(User) repo: Repository<User>,
    private readonly hash: HashService,
  ) {
    super(repo);
  }

  findByEmail(email: string) {
    return this.findOne({ email } as FindOptionsWhere<User>);
  }
  override async create(payload: Partial<User>) {
    try {
      return await super.create(payload);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        err.driverError?.code === '23505'
      ) {
        throw new ConflictException('Email или username уже заняты');
      }
      throw err;
    }
  }

  override async updateOne(where: Partial<User>, dto: Partial<User>) {
    if (dto.password) {
      dto.password = await this.hash.hash(dto.password);
    }
    return super.updateOne(where, dto);
  }

  findMany(q: string) {
    return this.repo.find({
      where: [{ username: ILike(`%${q}%`) }, { email: ILike(`%${q}%`) }],
      take: 20,
    });
  }

  findByUsername(name: string) {
    return this.repo.find({ where: { username: ILike(`%${name}%`) } });
  }

  findManyByEmail(part: string) {
    return this.repo.find({ where: { email: ILike(`%${part}%`) } });
  }
}
