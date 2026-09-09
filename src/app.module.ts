import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module.js";
import { AccountController } from "./controllers/account.controller.js";
import { envSchema } from "./env.js";
import { AuthModule } from "./auth/auth.module.js";
import { AuthenticateController } from "./controllers/authenticate.controller.js";
import { QuestionController } from "./controllers/question.controller.js";
import { JwtStrategy } from "./auth/jwt.strategy.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AccountController, AuthenticateController, QuestionController],
  providers: [PrismaModule, JwtStrategy],
})
export class AppModule {}
