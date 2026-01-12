import {IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateDetalleFacturaDto {
  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  cantidad?: number;

  @IsNumber()
  @IsOptional()
  precio_unitario?: number;
}

