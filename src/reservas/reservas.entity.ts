import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EstadoReserva } from './enums/estado-reserva.enum';
import { Vehiculo } from '../vehiculos/vehiculos.entity'; 

@Entity('reservas')
export class Reservas {
  @PrimaryGeneratedColumn('uuid')
  id_reserva: string;

  @Column()
  id_cliente: string; 

  

  @ManyToOne(() => Vehiculo, Vehiculo => Vehiculo.id_reservas, {
    onDelete: 'CASCADE',
    eager: true,
  })
  id_vehiculo: Vehiculo;

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
}
