import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { AuthGuard } from "@nestjs/passport";

@Controller('/question')
@UseGuards(AuthGuard('jwt'))
export class QuestionController {
    constructor(
        private prismaService: PrismaService
    ) {}

    @Post()
    async handle() {

    }
}