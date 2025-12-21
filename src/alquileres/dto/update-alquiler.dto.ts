import { IsNotEmpty, IsString, IsDate, IsDateString, IsNumberString } from 'class-validator';

export class UpdateAlquilerDto {

  @IsString()
  @IsNotEmpty()
  id_reserva: string;
  
  @IsDateString()
  fecha_entrega: string;
  
  @IsDateString()
  fecha_devolucion: string;
  
  @IsNumberString()
  km_inicial: string;
  
  @IsNumberString()
  km_final: string;
  
  @IsString()
  estado: string;
}