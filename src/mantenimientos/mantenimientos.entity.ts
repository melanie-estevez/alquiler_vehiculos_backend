import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehiculo } from '../vehiculos/vehiculos.entity';
import { EstadoRevision } from './enums/estado-revision.enum';
import { EstadoMantenimiento } from './enums/estado-mantenimiento.enum';

@Entity('mantenimientos')
export class Mantenimiento {
  @PrimaryGeneratedColumn('uuid')
  id_mantenimiento: string;

  @ManyToOne(() => Vehiculo, vehiculo => vehiculo.mantenimientos, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'id_vehiculo' })
  vehiculo: Vehiculo;

  @Column({ type: 'date' })
  fecha_revision: Date;

  @Column({
    type: 'enum',
    enum: EstadoRevision,
    default: EstadoRevision.PENDIENTE,
  })
  estado_revision: EstadoRevision;

  @Column({ default: false })
  requiere_mantenimiento: boolean;

  @Column({
    type: 'enum',
    enum: EstadoMantenimiento,
    nullable: true,
  })
  estado_mantenimiento: EstadoMantenimiento;

  @Column({ type: 'date', nullable: true })
  fecha_mantenimiento: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  costo: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;
}