import { IsNotEmpty, IsString, IsDateString, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

class InstructorDto {
  @IsNotEmpty()
  @IsString()
  id_usuario: string;

  @IsNotEmpty()
  @IsDateString()
  fecha: Date;
}

export class CreateHistorial_usuarioDto {

  @IsMongoId()
  id_reserva: string;

  @IsNotEmpty()
  @IsString()
  id_usuario: string;

  @IsNotEmpty()
  @IsString()
  accion: string;

  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @ValidateNested()
  @Type(() => InstructorDto)
  instructor: InstructorDto;
}