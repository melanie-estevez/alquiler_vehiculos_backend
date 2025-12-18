import { IsString, IsOptional, IsUUID, IsArray } from 'class-validator';

export class CreateSucursalesDto {
  @IsString()
  nombre: string;

  @IsString()
  ciudad: string;

  @IsString()
  direccion: string;

  @IsString()
  telefono: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  id_vehiculo?: string[];
}
