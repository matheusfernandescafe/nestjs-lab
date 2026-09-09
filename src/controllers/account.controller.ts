import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { hash } from "bcryptjs";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe.js";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class AccountController {
  constructor(private _prisma: PrismaService) {}

  @Post("/create")
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() request: CreateAccountBodySchema): Promise<void> {
    const { name, email, password } = request;

    const userWithSameEmail = await this._prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException(
        "User with same e-mail address alreayd exists.",
      );
    }

    const hashedPassword = await hash(password, 8);

    await this._prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
