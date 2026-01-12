import { IsBoolean, IsDate, IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  name: string;

  @IsString()
  apellido: string;

  @IsString()
  cedula:string

  @IsString()
  email: string;

  @IsString()
  celular: string;

  @IsDateString()
  fecha_nacimiento: string;

  @IsBoolean()
  licencia_conducir: boolean;

  @IsString()
  ciudad:string;
}
