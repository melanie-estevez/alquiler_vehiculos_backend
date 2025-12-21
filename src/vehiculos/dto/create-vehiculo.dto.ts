import {
  IsString,
  IsInt,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
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

  @IsEnum(EstadoVehiculo)
  @IsOptional()
  estado?: EstadoVehiculo;

  @IsUUID()
  @IsOptional()
  id_sucursal?: string;
}
