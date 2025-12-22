import { IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';

export class UpdateHistorial_usuarioDto {
  @IsOptional()
  @IsString()
  id_usuario?: string;

  @IsOptional()
  @IsUUID()
  id_reserva?: string;

  @IsOptional()
  @IsString()
  accion?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;
}