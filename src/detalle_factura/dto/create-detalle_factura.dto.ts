import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateDetalleFacturaDto {
  @IsString()
  descripcion: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio_unitario: number;

  @IsUUID()
  id_factura: string;
}
