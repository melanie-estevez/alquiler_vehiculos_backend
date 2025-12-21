import { IsDate, IsString, IsNotEmpty } from 'class-validator';

export class CreateAlquilerDto {
  password(password: any, arg1: number) {
      throw new Error('Method not implemented.');
  }


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
