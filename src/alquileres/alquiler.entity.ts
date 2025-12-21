import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne ,JoinColumn } from 'typeorm';
import { Reservas } from '../reservas/reservas.entity';

@Entity('alquiler')
export class Alquiler {
  @PrimaryGeneratedColumn('uuid')
  id_alquiler: string;

  @Column()
  id_reserva: string;

  @OneToOne(() => Reservas, (reserva) => reserva.alquiler, )
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reservas;

  @Column()
  fecha_entrega: Date;

  @Column()
  fecha_devolucion: Date;

  @Column()
  km_inicial: string;

  @Column()
  km_final: string;

  @Column()
  estado: string;
}
