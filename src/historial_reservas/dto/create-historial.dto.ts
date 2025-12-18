import { IsNotEmpty, IsString, IsArray, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContenidoDto } from './create-contenido.dto';

class InstructorDto {
  @IsNotEmpty()
  @IsString()
  id_reserva: string;

  @IsNotEmpty()
  @IsString()
  estado_anterior: string;
}

export class CreateHistorialDto {

  @IsNotEmpty()
  @IsString()
  id_reserva: string;

  @IsNotEmpty()
  @IsString()
  estado_anterior: string;

  @IsNotEmpty()
  @IsString()
  estado_nuevo: string;

  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @ValidateNested()
  @Type(() => InstructorDto)
  instructor: InstructorDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContenidoDto)
  contenidos: CreateContenidoDto[];
}