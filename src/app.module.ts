import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    //ObserveModule.forRoot({
    //  appKey: 'YOUR_APP_KEY',
    //  appSecret: 'YOUR_APP_SECRET',
    //  serviceId: '05-nest-clean',
    //}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
