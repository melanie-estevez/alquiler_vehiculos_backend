import { IsString, IsNumber } from 'class-validator';

export class CreateDetalleFacturaDto {
  @IsString()
  descripcion: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio_unitario: number;
}
