import { 
  IsNotEmpty, 
  IsString, 
  IsUUID,
  IsDateString
} from 'class-validator';

export class CreateContenidoDto {

  @IsUUID()
  @IsNotEmpty()
  id_usuario_pg: string;

  @IsUUID()
  @IsNotEmpty()
  id_reserva_pg: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;
}
