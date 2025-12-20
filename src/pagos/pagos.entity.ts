import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reservas } from '../reservas/reservas.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id_pago: string;

  @ManyToOne(() => Reservas, (reserva) => reserva.pagos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reservas;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column()
  metodo: string;

  @Column()
  estado: string;

  @Column({ type: 'timestamp' })
  fecha_pago: Date;
}
