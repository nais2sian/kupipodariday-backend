// app.module.ts
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
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get('NODE_ENV') === 'production';
        const url = config.get<string>('SUPABASE_DB_URL');

        // If SUPABASE_DB_URL is present, prefer it
        if (url) {
          return {
            type: 'postgres',
            url,
            ssl: { rejectUnauthorized: false }, // Supabase requires SSL
            autoLoadEntities: true,
            synchronize: !isProd,
            migrationsRun: true,
            logging: !isProd ? ['query', 'error'] : false,
          };
        }

        // Fallback to individual connection parameters
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST', 'localhost'),
          port: Number(config.get<string>('DB_PORT', '5432')),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),
          ssl:
            config.get('DB_SSL') === 'true'
              ? { rejectUnauthorized: false }
              : false,
          autoLoadEntities: true,
          synchronize: !isProd,
          migrationsRun: true,
          logging: !isProd ? ['query', 'error'] : false,
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

// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { UsersModule } from './users/users.module';
// import { WishesModule } from './wishes/wishes.module';
// import { WishlistsModule } from './wishlists/wishlists.module';
// import { OffersModule } from './offers/offers.module';
// import { HashModule } from './hash/hash.module';
// import { AuthModule } from './auth/auth.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: ['.env.testing', '.env.development', '.env'],
//     }),
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => ({
//         type: 'postgres',
//         host: config.get<string>('DB_HOST'),
//         port: Number(config.get<string>('DB_PORT', '5432')),
//         username: config.get<string>('DB_USERNAME'),
//         password: config.get<string>('DB_PASSWORD'),
//         database: config.get<string>('DB_DATABASE'),
//         autoLoadEntities: true,

//         synchronize: config.get('NODE_ENV') !== 'production',
//         logging:
//           config.get('NODE_ENV') !== 'production' ? ['query', 'error'] : false,
//         ssl:
//           config.get('DB_SSL') === 'true'
//             ? { rejectUnauthorized: false }
//             : false,
//       }),
//     }),

//     UsersModule,

//     WishesModule,

//     WishlistsModule,

//     OffersModule,

//     HashModule,

//     AuthModule,

//     HashModule,
//   ],

//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
