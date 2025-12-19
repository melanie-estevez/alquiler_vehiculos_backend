import { IsOptional, IsArray, IsUUID, IsString } from 'class-validator';

export class UpdateSucursalesDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

}
