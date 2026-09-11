import "dotenv/config"
import { PrismaService } from "../prisma/prisma.service.js"
import { randomUUID } from "node:crypto"
import { execSync } from "node:child_process"

const prisma = new PrismaService()
const schemaId = randomUUID()

function gerenrateUniqueDatabaseURL(schemaId: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error("PLease provider a DATABASE_URL environment variable.")
    }
    
    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set("schema", schemaId)
    return url.toString();
}

beforeAll(async () => {
    const databaseURL = gerenrateUniqueDatabaseURL(schemaId)
    
    process.env.DATABASE_URL = databaseURL

    execSync("npx prisma migrate deploy")
})

afterAll(async () => {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
    await prisma.$disconnect()
})