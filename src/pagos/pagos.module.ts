import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Pago } from './pagos.entity';
import { Alquiler } from '../alquileres/alquiler.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, Alquiler])],
  controllers: [PagosController],
  providers: [PagosService],
})
export class PagosModule {}