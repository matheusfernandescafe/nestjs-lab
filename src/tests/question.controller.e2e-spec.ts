import { AppModule } from "@/app.module.js"
import { PrismaService } from "@/prisma/prisma.service.js"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { randomUUID } from "node:crypto"

describe("Create question (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /question', async () => {
    const uuid = randomUUID()
    const user = await prisma.user.create({
        data: {
            name: `User ${uuid} Test`,
            email: `${uuid}@example.com`,
            password: '123',
        }
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 01',
          slug: 'question-01',
          content: 'Question content',
          authorId: user.id,
        },
        {
          title: 'Question 02',
          slug: 'question-02',
          content: 'Question content',
          authorId: user.id,
        },
        {
          title: 'Question 03',
          slug: 'question-03',
          content: 'Question content',
          authorId: user.id,
        },
      ]
    })

    const response = await request(app.getHttpServer())
      .get('/question')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      question: [
        expect.objectContaining({ title: 'Question 01' }),
        expect.objectContaining({ title: 'Question 02' }),
        expect.objectContaining({ title: 'Question 03' })
      ]
    })
  })

  test('[POST] /question', async () => {
    const uuid = randomUUID()
    const user = await prisma.user.create({
        data: {
            name: `User ${uuid} Test`,
            email: `${uuid}@example.com`,
            password: '123',
        }
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/question')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New question',
        content: 'Question content',
    })

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New question'
      }
    })

    expect((questionOnDatabase)).toBeTruthy()
  })
})