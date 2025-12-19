import { IsUUID, IsDateString, IsEnum, IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { EstadoReserva } from '../enums/estado-reserva.enum';

export class UpdateReservaDto {
  @IsOptional()
  //@IsUUID()
  @IsString()
  id_cliente?: string;

  @IsOptional()
  @IsUUID()
  id_vehiculo?: string;

  @IsOptional()
  @IsDateString()
  fecha_inicio?: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  dias?: number;

  @IsOptional()
  @IsDateString()
  fecha_fin?: Date;

  @IsOptional()
  @IsEnum(EstadoReserva)
  estado?: EstadoReserva;
}
