import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppMailService {
  private readonly log = new Logger(AppMailService.name);

  constructor(private readonly mailer: MailerService) {}

  async sendOfferNotification(to: string, wishName: string, amount: number) {
    try {
      await this.mailer.sendMail({
        to,
        subject: `Новый взнос на «${wishName}»`,
        template: 'offer',
        context: { wishName, amount },
      });
    } catch (err) {
      this.log.error(`Mail send failed → ${err.message}`);
    }
  }
}
