import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { HashModule } from './hash/hash.module';
import { AuthModule } from './auth/auth.module';

console.log(' ENV DEBUG', {
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_DB_URL: process.env.SUPABASE_DB_URL?.slice(0, 60),
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
});

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
      useFactory: (cfg: ConfigService) => {
        const url = cfg.get<string>('SUPABASE_DB_URL');
        if (!url) {
          throw new Error('SUPABASE_DB_URL is not defined');
        }

        const isProd = cfg.get('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          url,
          ssl: { rejectUnauthorized: false },
          autoLoadEntities: true,
          synchronize: !isProd,
          migrationsRun: true,
          logging: isProd ? false : ['query', 'error'],
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
