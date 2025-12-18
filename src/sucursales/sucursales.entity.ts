import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Vehiculo } from '../vehiculos/vehiculos.entity';

@Entity('sucursales')
export class Sucursales {
  @PrimaryGeneratedColumn('uuid')
  id_sucursal: string;

  @Column()
  nombre: string;

  @Column()
  ciudad: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @OneToMany(() => Vehiculo, vehiculo => vehiculo.id_sucursal)
  id_vehiculo: Vehiculo[]; 
}
