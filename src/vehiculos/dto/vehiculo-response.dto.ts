import { EstadoVehiculo } from '../enums/estado-vehiculo.enum';

export class VehiculoResponseDto {
  id_vehiculo: string;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  precio_diario: number;

  estado: EstadoVehiculo;

  sucursal?: {
    id_sucursal: string;
    nombre: string;
  } | null;
}