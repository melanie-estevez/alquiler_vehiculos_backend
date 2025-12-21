import { 
  IsNotEmpty, 
  IsString, 
  IsDateString, 
  IsUUID 
} from 'class-validator';

export class CreateHistorialDto {

  @IsUUID()
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
  id_usuario: any;
}