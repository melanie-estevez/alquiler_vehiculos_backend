import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreatePagosDto {
  @IsUUID()
  id_factura: string;

  @IsString()
  metodo: string;

  @IsOptional()
  @IsString()
  estado?: string;
}
