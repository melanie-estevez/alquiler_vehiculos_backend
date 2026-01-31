import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Sucursales } from '../sucursales/sucursales.entity';
import { Reservas } from '../reservas/reservas.entity';
import { Mantenimiento } from '../mantenimientos/mantenimientos.entity';
import { EstadoVehiculo } from './enums/estado-vehiculo.enum';

@Entity('vehiculos')
export class Vehiculos {
  @PrimaryGeneratedColumn('uuid')
  id_vehiculo: string;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column()
  anio: number;

  @Column()
  placa: string;

  @Column()
  precio_diario: number;

  @Column({
    type: 'enum',
    enum: EstadoVehiculo,
    default: EstadoVehiculo.DISPONIBLE,
  })
  estado: EstadoVehiculo;

  @Column({ nullable: true })
  imagen_url: string | null;

  @ManyToOne(() => Sucursales, sucursal => sucursal.vehiculos, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_sucursal' })
  sucursal: Sucursales | null;

  @OneToMany(() => Reservas, reserva => reserva.vehiculo)
  reservas: Reservas[];

  @OneToMany(() => Mantenimiento, mantenimiento => mantenimiento.vehiculo)
  mantenimientos: Mantenimiento[];
}
