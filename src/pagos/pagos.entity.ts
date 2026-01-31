import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Factura } from 'src/facturas/factura.entity';
import { Reservas } from 'src/reservas/reservas.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id_pago: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  monto: number;

  @Column()
  metodo: string;

  @Column()
  estado: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  fecha_pago: Date;

  @ManyToOne(() => Factura, (factura) => factura.pagos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_factura' })
  factura: Factura;

  @ManyToOne(() => Reservas, (reserva) => reserva.pagos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reservas;
}
