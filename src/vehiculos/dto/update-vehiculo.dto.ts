import { IsString, IsNumber, IsUUID, IsEnum, IsOptional, IsInt } from 'class-validator';
import { EstadoVehiculo } from '../enums/estado-vehiculo.enum';

export class UpdateVehiculoDto {
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

  @IsUUID()
  id_sucursal: string;
}
