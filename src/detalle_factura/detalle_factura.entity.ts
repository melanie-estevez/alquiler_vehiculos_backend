import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Factura } from '../facturas/factura.entity';

@Entity('detalle_factura')
export class DetalleFactura {
  @PrimaryGeneratedColumn('uuid')
  id_detalle: string;

  @Column()
  descripcion: string;

  @Column({ default: 1 })
  cantidad: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  precio_unitario: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => Factura, factura => factura.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({name:'id_factura'}) factura:Factura;

}
