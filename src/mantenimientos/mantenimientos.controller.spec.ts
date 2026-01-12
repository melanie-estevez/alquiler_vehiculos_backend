import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MantenimientoService } from './mantenimientos.service';
import { MantenimientoController } from './mantenimientos.controller';
import { Mantenimiento } from './mantenimientos.entity';
import { Vehiculo } from '../vehiculos/vehiculos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mantenimiento,
      Vehiculo,
    ]),
  ],
  controllers: [MantenimientoController],
  providers: [MantenimientoService],
})
export class MantenimientosModule {}