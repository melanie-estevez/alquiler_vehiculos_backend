import { Factura } from 'src/facturas/factura.entity';
import { Reservas } from 'src/reservas/reservas.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany} from 'typeorm';

@Entity('pago')
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id_pago: string;

  @Column()
  monto: number;

  @Column()
  metodo: string;

  @Column()
  estado: string;

  @Column()
  fecha_pago: string;

  @ManyToOne(() => Factura, factura => factura.pagos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_factura' })
  factura: Factura;
  
  @ManyToOne(() => Reservas, reserva => reserva.pagos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reservas;
}
