import { IsUUID, IsOptional, IsEnum } from 'class-validator';
import { EstadoFactura } from '../enums/estado-factura.enum';

export class UpdateFacturaDto {
  @IsOptional()
  @IsUUID()
  id_reserva?: string;

  @IsOptional()
  @IsUUID()
  id_cliente?: string;

  @IsOptional()
  @IsEnum(EstadoFactura)
  estado?: EstadoFactura;
}
