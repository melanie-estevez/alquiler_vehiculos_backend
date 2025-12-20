import { IsOptional, IsString } from 'class-validator';

export class UpdateDetalleFacturaDto {
  @IsString()
  @IsOptional()
  name?: string;
}
