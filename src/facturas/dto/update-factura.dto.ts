import { IsOptional, IsString } from 'class-validator';

export class UpdateFacturaDto {
  @IsString()
  @IsOptional()
  name?: string;
}
