import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreatePagosDto {
  @IsUUID()
  @IsNotEmpty()
  id_factura: string;

  @IsString()
  @IsNotEmpty()
  metodo: string;
}
