import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "../auth/current-user-decorator.js";
import * as jwtStrategy from "../auth/jwt.strategy.js";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe.js";

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

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

    @Get()
    async get(@Query('page', queryValidationPipe) page: PageQueryParamSchema)
    {
        const perPage = 2;
        const question = await this.prismaService.question.findMany({
            take: perPage,
            skip: (page - 1) * perPage,
            orderBy: {
                CreatedAt: 'desc',
            }
        })

        return { question };
    }

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