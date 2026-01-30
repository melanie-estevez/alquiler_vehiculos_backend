import { IsString, IsDateString, IsUUID, IsOptional } from 'class-validator';

export class CreatePagosDto {
  @IsUUID()
  id_factura: string;

  @IsOptional()
  @IsUUID()
  id_reserva?: string;

  @IsString()
  metodo: string;

  @IsString()
  estado: string;

  @IsDateString()
  fecha_pago: string;
}
