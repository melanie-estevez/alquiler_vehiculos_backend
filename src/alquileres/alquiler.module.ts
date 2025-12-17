import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlquilerService } from './alquiler.service';
import { AlquilerController } from './alquiler.controller';
import { Alquiler } from './alquiler.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alquiler])],
  controllers: [AlquilerController],
  providers: [AlquilerService],
})
export class AlquilerModule {}
