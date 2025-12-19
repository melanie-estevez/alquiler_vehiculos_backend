import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculoService } from './vehiculos.service';
import { VehiculoController } from './vehiculos.controller';
import { Vehiculo } from './vehiculos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehiculo])],
  controllers: [VehiculoController],
  providers: [VehiculoService],
})
export class VehiculosModule {}
