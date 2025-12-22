import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetallesFacturaService } from './detalle_factura.service';
import { DetallesFacturaController } from './detalle_factura.controller';
import { DetalleFactura } from './detalle_factura.entity';
import { Factura } from 'src/facturas/factura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleFactura, Factura])],
  controllers: [DetallesFacturaController],
  providers: [DetallesFacturaService],
})
export class DetallesFacturaModule {}