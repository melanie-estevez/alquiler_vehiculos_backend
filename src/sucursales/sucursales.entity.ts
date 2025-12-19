import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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

  @OneToMany(() => Vehiculo, vehiculo => vehiculo.sucursal)
  vehiculos: Vehiculo[];
}
