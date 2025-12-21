import { IsString, IsNumber, IsDateString, IsUUID } from 'class-validator';

export class CreatePagosDto {
  @IsUUID()
  id_factura: string;

  @IsUUID()
  id_reserva: string;

  @IsNumber()
  monto: number;

  @IsString()
  metodo: string;

  @IsString()
  estado: string;

  @IsDateString()
  fecha_pago: string;
}
