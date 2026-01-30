import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { Pago } from './pagos.entity';
import { Factura } from 'src/facturas/factura.entity';
import { Reservas } from 'src/reservas/reservas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, Factura, Reservas])],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule {}
