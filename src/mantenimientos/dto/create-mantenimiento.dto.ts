import { IsUUID, IsDateString, IsEnum, IsBoolean, IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { EstadoRevision } from '../enums/estado-revision.enum';
import { EstadoMantenimiento } from '../enums/estado-mantenimiento.enum';

export class CreateMantenimientoDto {
  
  @IsUUID()
  id_vehiculo: string;

  @IsDateString()
  fecha_revision: string;

  @IsEnum(EstadoRevision)
  estado_revision: EstadoRevision;

  @IsBoolean()
  requiere_mantenimiento: boolean;

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
