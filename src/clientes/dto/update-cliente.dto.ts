import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateClienteDto {
  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  celular?: string;

  @IsOptional()
  @IsDate()
  fecha_nacimiento?: Date;

  @IsOptional()
  @IsBoolean()
  licencia_conducir?: string;

  @IsOptional()
  @IsString()
  ciudad?:string;
}