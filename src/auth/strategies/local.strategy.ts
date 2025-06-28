import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as LocalStrategyBase } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(LocalStrategyBase) {
  constructor(private readonly auth: AuthService) {
    super({ usernameField: 'username' });
  }

  validate(username: string, password: string) {
    return this.auth.validate(username, password);
  }
}
