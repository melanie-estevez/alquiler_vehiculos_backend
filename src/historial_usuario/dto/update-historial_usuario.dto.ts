import { IsNotEmpty, IsString,IsDateString, IsOptional} from 'class-validator';

export class UpdateHistorial_usuarioDto {
  @IsString()
  id_usuario: string;

  @IsNotEmpty()
  accion: string;

  @IsOptional()
  @IsDateString()
  fecha: Date;
}