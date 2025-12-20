import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Pago } from './pagos.entity';
import { Reservas } from '../reservas/reservas.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pago,
      Reservas,
    ]),
  ],
  controllers: [PagosController],
  providers: [PagosService],
})
export class PagosModule {}
