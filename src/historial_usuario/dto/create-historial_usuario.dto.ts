import { IsNotEmpty, IsString, IsUUID, IsDateString } from 'class-validator';

export class CreateHistorial_usuarioDto {
  @IsNotEmpty()
  @IsString()
  id_usuario: string;

  @IsNotEmpty()
  @IsUUID()
  id_reserva: string;

  @IsNotEmpty()
  @IsString()
  accion: string;

  @IsNotEmpty()
  @IsDateString()
  fecha: string;
}