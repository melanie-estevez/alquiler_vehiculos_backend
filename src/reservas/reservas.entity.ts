import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehiculo } from '../vehiculos/vehiculos.entity';
import { EstadoReserva } from './enums/estado-reserva.enum';

@Entity('reservas')
export class Reservas {
  @PrimaryGeneratedColumn('uuid')
  id_reserva: string;

  @Column()
  id_cliente: string;

  @ManyToOne(() => Vehiculo, vehiculo => vehiculo.reservas, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'id_vehiculo' })
  vehiculo: Vehiculo;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column()
  dias: number;

  @Column({ type: 'date' })
  fecha_fin: Date;

  @Column({
    type: 'enum',
    enum: EstadoReserva,
    default: EstadoReserva.PENDIENTE,
  })
  estado: EstadoReserva;
  facturas: any;
}
