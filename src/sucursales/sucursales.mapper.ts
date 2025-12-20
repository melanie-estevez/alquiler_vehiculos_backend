import { Sucursales } from './sucursales.entity';

export const mapSucursalToResponse = (sucursal: Sucursales) => ({
  id: sucursal.id_sucursal,
  nombre: sucursal.nombre,
  ciudad: sucursal.ciudad,
  direccion: sucursal.direccion,
  telefono: sucursal.telefono,

  totalVehiculos: sucursal.vehiculos?.length ?? 0,
});
