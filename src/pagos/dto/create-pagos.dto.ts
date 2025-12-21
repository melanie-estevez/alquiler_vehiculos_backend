import {
  IsUUID,
  IsNumber,
  IsString,
  IsDateString,
  Min,
  IsEnum,
} from 'class-validator';
import { EstadoPago } from '../enums/estado-pagos.enum';

export class CreatePagosDto {
  @IsUUID()
  id_reserva: string;

   @IsUUID()
  id_factura: string;

  @IsNumber()
  @Min(0)
  monto: number;

  @IsString()
  metodo: string;

  @IsEnum(EstadoPago)
  estado: EstadoPago;

  @IsDateString()
  fecha_pago: Date;
}
