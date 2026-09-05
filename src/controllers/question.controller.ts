import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../auth/current-user-decorator.js";
import * as jwtStrategy from "../auth/jwt.strategy.js";

@Controller('/question')
@UseGuards(AuthGuard('jwt'))
export class QuestionController {
    constructor(
        private prismaService: PrismaService
    ) {}

    @Post()
    async handle(@CurrentUser() user: jwtStrategy.UserPayload) {
        return 'ok';
    }
}