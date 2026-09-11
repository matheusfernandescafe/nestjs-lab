import { AppModule } from "@/app.module.js"
import { PrismaService } from "@/prisma/prisma.service.js"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe("Create account (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /accounts/create', async () => {
    const response = await request(app.getHttpServer()).post('/accounts/create').send({
      name: 'User Test',
      email: 'email@example.com',
      password: '123',
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'email@example.com'
      }
    })

    expect((userOnDatabase)).toBeTruthy()
  })
})