import { Body, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../auth/current-user-decorator.js";
import * as jwtStrategy from "../auth/jwt.strategy.js";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe.js";

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/question')
@UseGuards(AuthGuard('jwt'))
export class QuestionController {
    constructor(
        private prismaService: PrismaService
    ) {}

    @Post()
    async handle(
        @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema,
        @CurrentUser() user: jwtStrategy.UserPayload)
    {
        const { title, content } = body;
        const { sub: userId } = user;
        const slug = this.convertToSlug(title);

        await this.prismaService.question.create({
            data: {
                AuthorId: userId,
                Title: title,
                Content: content,
                Slug: slug,
            }
        })
    }

    private convertToSlug(title: string): string {
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
    }
}