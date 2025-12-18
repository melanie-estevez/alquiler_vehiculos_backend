import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { EstadoVehiculo } from './enums/estado-vehiculo.enum';
import { Reservas } from '../reservas/reservas.entity';
import { Mantenimiento } from '../mantenimientos/mantenimientos.entity';
import { Sucursales } from '../sucursales/sucursales.entity';

@Entity('vehiculo')
export class Vehiculo {
  @PrimaryGeneratedColumn('uuid')
  id_vehiculo: string;

  @Column({ type: 'varchar', length: 100 })
  marca: string;

  @Column({ type: 'varchar', length: 100 })
  modelo: string;

  @Column({ type: 'int' })
  anio: number;

  @Column({ type: 'varchar', length: 10 })
  placa: string;

  @Column({ type: 'decimal' })
  precio_diario: number;

  @Column({
    type: 'enum',
    enum: EstadoVehiculo,
    default: EstadoVehiculo.DISPONIBLE,
  })
  estado: EstadoVehiculo;


  @OneToMany(() => Reservas, (reserva) => reserva.id_vehiculo)
  id_reservas: Reservas[];

  @OneToMany(() => Mantenimiento, (mantenimiento) => mantenimiento.id_vehiculo)
  id_mantenimientos: Mantenimiento[];


  @ManyToOne(() => Sucursales, sucursal => sucursal.id_vehiculo)
  @JoinColumn({ name: 'id_sucursal' })
  id_sucursal: Sucursales;
  
}
