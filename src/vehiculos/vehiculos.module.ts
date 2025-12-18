import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VehiculoService } from './vehiculos.service';
import { VehiculoController } from './vehiculos.controller';
import { Vehiculo } from './vehiculos.entity';
import { Sucursales } from '../sucursales/sucursales.entity';
import { Reservas } from '../reservas/reservas.entity';
import { Mantenimiento } from '../mantenimientos/mantenimientos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vehiculo,
      Sucursales,
      Reservas,
      Mantenimiento,
    ]),
  ],
  controllers: [VehiculoController],
  providers: [VehiculoService],
  exports: [TypeOrmModule], 
})
export class VehiculosModule {}
