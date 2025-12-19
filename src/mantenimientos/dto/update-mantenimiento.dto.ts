import { IsUUID, IsDateString, IsEnum, IsBoolean, IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { EstadoRevision } from '../enums/estado-revision.enum';
import { EstadoMantenimiento } from '../enums/estado-mantenimiento.enum';

export class UpdateMantenimientoDto {

  @IsOptional()
  @IsUUID()
  id_vehiculo?: string;

  @IsOptional()
  @IsDateString()
  fecha_revision?: string;

  @IsOptional()
  @IsEnum(EstadoRevision)
  estado_revision?: EstadoRevision;

  @IsOptional()
  @IsBoolean()
  requiere_mantenimiento?: boolean;

  @IsOptional()
  @IsEnum(EstadoMantenimiento)
  estado_mantenimiento?: EstadoMantenimiento;

  @IsOptional()
  @IsDateString()
  fecha_mantenimiento?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costo?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
