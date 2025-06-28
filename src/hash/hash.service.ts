import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  private readonly rounds = 10;

  hash(plain: string) {
    return bcrypt.hash(plain, this.rounds);
  }

  compare(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }
}
