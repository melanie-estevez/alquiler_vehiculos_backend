import { IsDate, IsString, IsNotEmpty, IsDateString, IsNumberString, IsUUID } from 'class-validator';

export class CreateAlquilerDto {
  password(password: any, arg1: number) {
      throw new Error('Method not implemented.');
  }
  @IsUUID()
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
