import { IsString, IsNumber, IsUUID, IsEnum, IsOptional, IsInt } from 'class-validator';
import { EstadoVehiculo } from '../enums/estado-vehiculo.enum';

export class CreateVehiculoDto {
  @IsString()
  marca: string;

  @IsString()
  modelo: string;

  @IsInt()
  anio: number;

  @IsString()
  placa: string;

  @IsNumber()
  precio_diario: number;

  @IsEnum(EstadoVehiculo)
  @IsOptional()
  estado?: EstadoVehiculo;

  @IsOptional()
  @IsUUID('all', { each: true })
  id_sucursal?: string;
}