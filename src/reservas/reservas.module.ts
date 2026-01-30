import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReservaService } from './reservas.service';
import { ReservaController } from './reservas.controller';
import { Reservas } from './reservas.entity';
import { Vehiculo } from '../vehiculos/vehiculos.entity';
import { ClientesModule } from 'src/clientes/clientes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservas, Vehiculo]),
    ClientesModule,
  ],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservasModule {}
