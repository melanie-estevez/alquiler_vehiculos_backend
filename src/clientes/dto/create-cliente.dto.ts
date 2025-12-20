import { IsDate, IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  name: string;

  @IsString()
  apellido: string;

  @IsNumber()

  @IsString()
  email: string;

  @IsNumber()
  celular: string;

  @IsDateString()
  fecha_nacimiento: string;

  @IsString()
  licencia_confucir: boolean;

  @IsString()
  ciudad:string;

  @IsUUID()
  user_id: string;
}
