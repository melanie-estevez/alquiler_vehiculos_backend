import { IsNotEmpty, IsString,IsDateString, IsOptional} from 'class-validator';

export class UpdateHistorialDto {
  @IsString()
  id_reserva: string;

  @IsNotEmpty()
  estado_anterior: string;

  @IsNotEmpty()
  estado_nuevo: string;

  @IsOptional()
  @IsDateString()
  fecha: Date;
}