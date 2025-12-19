import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreatePagosDto {
  @IsString()
  id_pago: string;

  @IsString()
  id_reserva: string;

  @IsNumber()
  monto: number;

  @IsString()
  metodo: string;

  @IsString()
  estado: string;

  @IsDate()
  fecha_pago: Date;
}
