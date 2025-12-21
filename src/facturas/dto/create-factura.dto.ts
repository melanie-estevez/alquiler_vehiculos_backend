import { IsUUID, IsArray, IsOptional, IsEnum } from 'class-validator';
import { CreateDetalleFacturaDto } from 'src/detalle_factura/dto/create-detalle_factura.dto';
import { EstadoFactura } from '../enums/estado-factura.enum';

export class CreateFacturaDto {
  @IsUUID()
  id_reserva: string;

  @IsUUID()
  id_cliente: string;

  @IsArray()
  detalles: CreateDetalleFacturaDto[];

  @IsOptional()
  @IsEnum(EstadoFactura)
  estado?: EstadoFactura; 
}
