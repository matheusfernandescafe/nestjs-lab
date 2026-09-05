import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { PrismaModule } from './prisma/prisma.module.js';
import { AccountController } from './controllers/account.controller.js';
import { envSchema } from './env.js';
import { AuthModule } from './auth/auth.module.js';
import { AuthenticateController } from './controllers/authenticate.controller.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    //ObserveModule.forRoot({
    //  appKey: 'YOUR_APP_KEY',
    //  appSecret: 'YOUR_APP_SECRET',
    //  serviceId: '05-nest-clean',
    //}),
  ],
  controllers: [AccountController, AuthenticateController],
  providers: [PrismaModule],
})
export class AppModule {}
