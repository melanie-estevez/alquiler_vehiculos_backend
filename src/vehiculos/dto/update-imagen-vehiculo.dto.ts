import { IsOptional, IsString } from 'class-validator';

export class UpdateImagenVehiculoDto {
  @IsString()
  @IsOptional()
  imagen_url?: string;
}
