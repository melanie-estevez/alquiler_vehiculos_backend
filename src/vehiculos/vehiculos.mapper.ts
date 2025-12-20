import { Vehiculo } from './vehiculos.entity';
import { VehiculoResponseDto } from './dto/vehiculo-response.dto';

export function mapVehiculoToResponse(
  vehiculo: Vehiculo,
): VehiculoResponseDto {
  return {
    id_vehiculo: vehiculo.id_vehiculo,
    marca: vehiculo.marca,
    modelo: vehiculo.modelo,
    anio: vehiculo.anio,
    placa: vehiculo.placa,
    precio_diario: vehiculo.precio_diario,

    estado: vehiculo.estado,      
    

    sucursal: vehiculo.sucursal
      ? {
          id_sucursal: vehiculo.sucursal.id_sucursal,
          nombre: vehiculo.sucursal.nombre,
        }
      : null,
  };
}
