import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Reservas } from '../reservas/reservas.entity';
import { Cliente } from '../clientes/cliente.entity';
import { DetalleFactura } from '../detalle_factura/detalle_factura.entity';
import { EstadoFactura } from './enums/estado-factura.enum';

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn('uuid')
  id_factura: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  fecha_emision: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  iva: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => Reservas, reserva => reserva.facturas)
  id_reserva: Reservas;

  @ManyToOne(() => Cliente, cliente => cliente.facturas)
  id_cliente: Cliente;

  @Column({
  type: 'enum',
  enum: EstadoFactura,
  default: EstadoFactura.PENDIENTE,
  })
  estado: EstadoFactura;

  @OneToMany(() => DetalleFactura, detalle => detalle.id_factura, { cascade: true })
  detalles: DetalleFactura[];
}
