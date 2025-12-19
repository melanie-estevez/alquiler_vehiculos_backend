import { IsNotEmpty, IsString, IsArray, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContenidoDto } from './create-contenido.dto';

class InstructorDto {
  @IsNotEmpty()
  @IsString()
  id_usuario: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}

export class CreateLogsDto {

  @IsNotEmpty()
  @IsString()
  id_usuario: string;

  @IsNotEmpty()
  @IsString()
  accion: string;

  @IsNotEmpty()
  @IsString()
  ip: string;

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