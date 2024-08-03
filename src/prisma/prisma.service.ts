import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (err) {
      this.logger.error(err);
    }
  }
  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (err) {
      this.logger.error(err);
    }
  }
}
