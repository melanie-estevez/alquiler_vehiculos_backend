import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SucursalesService } from './sucursales.service';
import { SucursalesController } from './sucursales.controller';
import { Sucursales } from './sucursales.entity';
import { Vehiculo } from '../vehiculos/vehiculos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sucursales,
      Vehiculo, 
    ]),
  ],
  controllers: [SucursalesController],
  providers: [SucursalesService],
})
export class SucursalesModule {}
