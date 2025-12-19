import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class UpdateAlquilerDto {
  @IsString()
  @IsNotEmpty()
  id_alquiler: string;

  @IsString()
  @IsNotEmpty()
  id_reserva: string;
  
  @IsDate()
  fecha_entrega: Date;
  
  @IsDate()
  fecha_devolucion: Date;
  
  @IsString()
  km_inicial: string;
  
  @IsString()
  km_final: string;
  
  @IsString()
  estado: string;
}
