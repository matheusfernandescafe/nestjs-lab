import { Body, ConflictException, Controller, Post } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Controller('/accounts')

export class AccountController {
    constructor(private prisma: PrismaService) {}
    
    @Post('/create')
    async  handle(@Body()  request: any) {
        const { name, email, password } = request;

        const userWithSameEmail = await this.prisma.user.findUnique({
            where: {
                Email: email,
            }
        });

        if (userWithSameEmail) {
            throw new ConflictException('User with same e-mail address alreayd exists.')
        }

        await this.prisma.user.create({
            data: {
                Name: name,
                Email: email,
                Password: password,
            },
        })
    }
}