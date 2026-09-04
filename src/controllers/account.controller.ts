import { Body, ConflictException, Controller, Post, UsePipes } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { ZodValidationPipe } from "../pipes/zod-validation-pipe.js";

const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')

export class AccountController {
    constructor(private prisma: PrismaService) {}
    
    @Post('/create')
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async  handle(@Body()  request: CreateAccountBodySchema) {
        const { name, email, password } = request;

        const userWithSameEmail = await this.prisma.user.findUnique({
            where: {
                Email: email,
            }
        });

        if (userWithSameEmail) {
            throw new ConflictException('User with same e-mail address alreayd exists.')
        }

        const hashedPassword = await hash(password, 8);

        await this.prisma.user.create({
            data: {
                Name: name,
                Email: email,
                Password: hashedPassword,
            },
        })
    }
}