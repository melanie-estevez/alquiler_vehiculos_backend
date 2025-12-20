import {
  IsOptional,
  IsNumber,
  IsString,
  IsDateString,
  Min,
  IsEnum,
} from 'class-validator';
import { EstadoPago } from '../enums/estado-pagos.enum';

export class UpdatePagosDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  monto?: number;

  @IsOptional()
  @IsString()
  metodo?: string;

  @IsOptional()
  @IsEnum(EstadoPago)
  estado?: EstadoPago;

  @IsOptional()
  @IsDateString()
  fecha_pago?: Date;
}
