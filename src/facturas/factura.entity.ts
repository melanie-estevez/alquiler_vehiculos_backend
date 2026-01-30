import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Reservas } from '../reservas/reservas.entity';
import { Cliente } from '../clientes/cliente.entity';
import { DetalleFactura } from '../detalle_factura/detalle_factura.entity';
import { EstadoFactura } from './enums/estado-factura.enum';
import { Pago } from 'src/pagos/pagos.entity';

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn('uuid')
  id_factura: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  fecha_emision: Date;

  @Column({
    type: 'enum',
    enum: EstadoFactura,
    default: EstadoFactura.PENDIENTE,
  })
  estado: EstadoFactura;

  @ManyToOne(() => Cliente, (cliente) => cliente.facturas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @ManyToOne(() => Reservas, (reserva) => reserva.facturas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reservas;

  @OneToMany(() => DetalleFactura, (detalle) => detalle.factura, { cascade: true })
  detalles: DetalleFactura[];

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  iva: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => Pago, (pago) => pago.factura, { cascade: true })
  pagos: Pago[];
}
