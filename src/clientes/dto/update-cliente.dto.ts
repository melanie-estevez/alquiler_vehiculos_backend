import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateClienteDto {
  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsString()
  apellido?: string;

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
  @IsString()
  ciudad?:string;
}