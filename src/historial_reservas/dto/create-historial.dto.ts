import { IsNotEmpty, IsString, IsDateString} from 'class-validator';
export class CreateHistorialDto {

  @IsString()
  @IsNotEmpty()
  id_reserva: string;

  @IsString()
  @IsNotEmpty()
  estado_anterior: string;

  @IsString()
  @IsNotEmpty()
  estado_nuevo: string;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;
}