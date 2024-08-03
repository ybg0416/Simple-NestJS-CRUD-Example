import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MemberModule } from '../member/member.module';
import { PrismaModule } from '../prisma/prisma.module';
import { HealthModule } from '../health/health.module';
import * as Joi from 'joi';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      cache: true,
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string(),
      }),
    }),
    PrismaModule,
    MemberModule,
    HealthModule,
  ],
})
export class AppModule {}
