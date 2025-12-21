import { Mantenimiento } from './mantenimientos.entity';
import { MantenimientoResponseDto } from './dto/mantenimiento-response.dto';

export const mapMantenimientoToResponse = (
  m: Mantenimiento,
): MantenimientoResponseDto => ({
  id: m.id_mantenimiento,
  fecha_revision: m.fecha_revision.toISOString(),
  estado_revision: m.estado_revision,
  requiere_mantenimiento: m.requiere_mantenimiento,
  estado_mantenimiento: m.estado_mantenimiento ?? null,
  fecha_mantenimiento: m.fecha_mantenimiento
    ? m.fecha_mantenimiento.toISOString()
    : null,
  costo: m.costo ?? null,
  observaciones: m.observaciones ?? null,
  vehiculo: {
    id: m.vehiculo.id_vehiculo,
    marca: m.vehiculo.marca,
    modelo: m.vehiculo.modelo,
    placa: m.vehiculo.placa,
  },
});
