import { IsUUID, IsDateString, IsEnum, IsNumber, Min, IsString } from 'class-validator';
import { EstadoReserva } from '../enums/estado-reserva.enum';

export class CreateReservaDto {
  //@IsUUID()
  //id_cliente: string;

  @IsString( )
  id_cliente: string;

  @IsUUID()
  id_vehiculo: string;

  @IsDateString()
  fecha_inicio: Date;

  @IsNumber()
  @Min(1)
  dias: number;

  @IsDateString()
  fecha_fin: Date;

  @IsEnum(EstadoReserva)
  estado?: EstadoReserva; 
}
