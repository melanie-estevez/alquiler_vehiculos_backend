import { IsDate, IsNumber, IsString } from 'class-validator';

export class UpdateVehiculoDto {

@IsString()
  marca: string;

  @IsString()
  modelo: string;
  
  @IsNumber()
  anio: number;

  @IsString()
  placa: string;

  @IsNumber()
  precio_diario: number;

  @IsString()
  estado: string

}
