import {
  IsString,
  IsInt,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { EstadoVehiculo } from '../enums/estado-vehiculo.enum';

export class UpdateVehiculoDto {
  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsInt()
  anio?: number;

  @IsOptional()
  @IsString()
  placa?: string;

  @IsOptional()
  @IsEnum(EstadoVehiculo)
  estado?: EstadoVehiculo;

  // puede venir UUID o null
  @IsOptional()
  id_sucursal?: string | null;
}
