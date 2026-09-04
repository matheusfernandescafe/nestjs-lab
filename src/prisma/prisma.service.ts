import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const databaseURL = new URL(process.env.DATABASE_URL!);
    const schema = databaseURL.searchParams.get('schema');

    const adapter = new PrismaPg(
      { connectionString: databaseURL.toString() },
      { schema: schema || 'public' },
    );

    super({
      adapter,
      log: ['warn', 'error'],
    });
  }

  onModuleInit() {
    return this.$connect();
  }

  onModuleDestroy() {
    return this.$disconnect();
  }
}