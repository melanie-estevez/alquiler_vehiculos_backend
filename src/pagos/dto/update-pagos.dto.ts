import { IsOptional, IsString, IsNumber, IsDateString, IsUUID } from 'class-validator';

export class UpdatePagosDto {
  @IsOptional()
  @IsUUID()
  id_factura?: string;

  @IsOptional()
  @IsUUID()
  id_reserva?: string;

  @IsOptional()
  @IsNumber()
  monto?: number;

  @IsOptional()
  @IsString()
  metodo?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsDateString()
  fecha_pago?: string;
}