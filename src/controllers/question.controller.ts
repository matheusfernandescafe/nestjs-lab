import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { AuthGuard } from "@nestjs/passport";
import { currentUser } from "../auth/current-user-decorator.js";
import type { UserPayload } from "../auth/jwt.strategy.js";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe.js";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller("/question")
@UseGuards(AuthGuard("jwt"))
export class QuestionController {
  constructor(private _prismaService: PrismaService) {}

  @Get()
  async get(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
  ): Promise<{ question: unknown[] }> {
    const perPage = 10;
    const question = await this._prismaService.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { question };
  }

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @currentUser() user: UserPayload,
  ): Promise<void> {
    const { title, content } = body;
    const { sub: userId } = user;
    const slug = this._convertToSlug(title);

    await this._prismaService.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    });
  }

  private _convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
}
