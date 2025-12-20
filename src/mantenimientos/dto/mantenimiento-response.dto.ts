export class MantenimientoResponseDto {
  id: string;
  fecha_revision: string;
  estado_revision: string;
  requiere_mantenimiento: boolean;
  estado_mantenimiento: string | null;
  fecha_mantenimiento: string | null;
  costo: number | null;
  observaciones: string | null;
  vehiculo: {
    id: string;
    marca: string;
    modelo: string;
    placa: string;
  };
}
