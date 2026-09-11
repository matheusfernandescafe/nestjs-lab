import { AppModule } from "@/app.module.js"
import { PrismaService } from "@/prisma/prisma.service.js"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { hash } from "bcryptjs";
import request from "supertest"

describe("Authenticate (E2E)", () => {
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

  test('[POST] /sessions', async () => {
    await prisma.user.create({
        data: {
            name: 'User Test',
            email: 'email@example.com',
            password: await hash('123', 8),
        }
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'email@example.com',
      password: '123',
    })

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'email@example.com'
      }
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
        accessToken: expect.any(String)
    })
  })
})