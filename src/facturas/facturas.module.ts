import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { Factura } from './factura.entity';
import { DetalleFactura } from 'src/detalle_factura/detalle_factura.entity';
import { Cliente } from 'src/clientes/cliente.entity';
import { Reservas } from 'src/reservas/reservas.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Factura, Reservas, Cliente, DetalleFactura])],
  controllers: [FacturasController],
  providers: [FacturasService],
})
export class FacturasModule {}
