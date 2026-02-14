import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { LoggerOptions } from 'typeorm';
import type { TlsOptions } from 'tls';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { HashModule } from './hash/hash.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? []
          : ['.env.testing', '.env.development', '.env'],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService): TypeOrmModuleOptions => {
        const url = cfg.get<string>('DATABASE_URL');
        if (!url) {
          throw new Error('DATABASE_URL is not defined');
        }

        const nodeEnv = cfg.get<string>('NODE_ENV') ?? 'development';
        const isProd = nodeEnv === 'production';

        const ssl: boolean | TlsOptions = isProd
          ? { rejectUnauthorized: false }
          : false;

        const logging: LoggerOptions = isProd ? false : ['query', 'error'];

        return {
          type: 'postgres',
          url,
          ssl,
          autoLoadEntities: true,
          synchronize: !isProd,
          migrationsRun: true,
          logging,
        };
      },
    }),

    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    HashModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
