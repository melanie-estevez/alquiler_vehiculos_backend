import { IsEnum } from 'class-validator';
import { EstadoVehiculo } from '../enums/estado-vehiculo.enum';

export class UpdateEstadoVehiculoDto {
  @IsEnum(EstadoVehiculo)
  estado: EstadoVehiculo;
}
