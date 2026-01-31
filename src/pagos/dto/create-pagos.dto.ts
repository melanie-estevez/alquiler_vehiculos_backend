import { IsUUID, IsString } from 'class-validator';

export class CreatePagosDto {
  @IsUUID()
  id_factura: string;

  @IsString()
  metodo: string;
}
