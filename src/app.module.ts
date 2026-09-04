import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { PrismaModule } from './prisma/prisma.module.js';
import { AccountController } from './controllers/account.controller.js';
import { envSchema } from './env.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    PrismaModule,
    //ObserveModule.forRoot({
    //  appKey: 'YOUR_APP_KEY',
    //  appSecret: 'YOUR_APP_SECRET',
    //  serviceId: '05-nest-clean',
    //}),
  ],
  controllers: [AccountController],
  providers: [PrismaModule],
})
export class AppModule {}
