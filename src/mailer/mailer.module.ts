import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppMailService } from './mailer.service';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        transport: {
          host: cfg.get('MAIL_HOST'),
          port: Number(cfg.get('MAIL_PORT')),
          secure: cfg.get('MAIL_SECURE') === 'true',
          auth: {
            user: cfg.get('MAIL_USER'),
            pass: cfg.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: cfg.get('MAIL_FROM'),
        },
        template: {
          dir: path.join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
  ],
  providers: [AppMailService],
  exports: [AppMailService],
})
export class AppMailModule {}
