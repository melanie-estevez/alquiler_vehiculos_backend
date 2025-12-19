import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';

export class UpdatePagosDto {
  @IsOptional()
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
