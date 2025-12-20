import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class MantenimientoQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
