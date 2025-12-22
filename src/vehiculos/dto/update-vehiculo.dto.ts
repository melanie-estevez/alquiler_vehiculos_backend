import {
  IsString,
  IsInt,
  IsOptional,
  IsUUID,
  IsEnum,
  IsNumber,
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

  @IsNumber()
  precio_diario: number;

  @IsOptional()
  @IsString()
  placa?: string;

  @IsOptional()
  @IsEnum(EstadoVehiculo)
  estado?: EstadoVehiculo;


  @IsOptional()
  id_sucursal?: string | null;
}
