import { IsUUID, IsDateString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateReservaDto {
  @IsUUID()
  id_vehiculo: string;

  @IsDateString()
  fecha_inicio: Date;

  @IsNumber()
  @Min(1)
  dias: number;

  @IsDateString()
  fecha_fin: Date;

  @IsOptional()
  @IsUUID()
  id_cliente?: string;
}
