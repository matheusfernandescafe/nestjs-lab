import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Module({
  providers: [PrismaService], // Instancia o serviço
  exports: [PrismaService],   // Permite que outros módulos usem o serviço
})
export class PrismaModule {}