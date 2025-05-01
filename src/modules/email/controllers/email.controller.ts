import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessAuthGuard } from 'src/middlewares/guards';
import {
  IMailerServiceProvider,
  IQueueServiceProvider,
} from 'src/cores/contracts';
import { QueueMailerProcessor } from 'src/cores/consts';

@ApiTags('Email')
@UseGuards(AccessAuthGuard)
@Controller({
  path: 'email',
  version: '1.0',
})
export class EmailController {
  constructor(
    private readonly mailerProvider: IMailerServiceProvider,
    private readonly queueProvider: IQueueServiceProvider,
  ) {}

  @Post('send')
  async send() {
    // await this.queueProvider.mailer.addBulk([
    //   {
    //     name: QueueMailerProcessor.SendEmail,
    //     data: {
    //       from: 'template@nest.com',
    //       to: 'user1@email.com',
    //       template: 'email',
    //       context: {
    //         link: 'http://localhost:3000',
    //       },
    //     },
    //   },
    //   {
    //     name: QueueMailerProcessor.SendEmail,
    //     data: {
    //       from: 'template@nest.com',
    //       to: 'user2@email.com',
    //       template: 'email',
    //       context: {
    //         link: 'http://localhost:3000',
    //       },
    //     },
    //   },
    // ]);

    await this.queueProvider.mailer.add(QueueMailerProcessor.SendEmail, {
      to: 'template@gmail.com',
      template: 'email-verification',
      context: {
        link: 'http://localhost:3000',
      },
    });

    // await this.mailerProvider.send({
    //   to: 'user@email.com',
    //   template: 'email',
    //   context: {
    //     link: 'http://localhost:3000',
    //   },
    // });
  }
}
