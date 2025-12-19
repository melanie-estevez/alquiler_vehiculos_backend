import { IsDate, IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  name: string;

  @IsString()
  apellido: string;

  @IsString()
  email: string;

  @IsNumber()
  celular: string;

  @IsDateString()
  fecha_nacimiento: string;

  @IsString()
  ciudad:string;

  @IsUUID()
  user_id: string;
}
