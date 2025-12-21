import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Vehiculo } from '../vehiculos/vehiculos.entity';
import { EstadoReserva } from './enums/estado-reserva.enum';
import { Cliente } from 'src/clientes/cliente.entity';
import { Factura } from 'src/facturas/factura.entity';
import { Pago } from 'src/pagos/pagos.entity';
import { Alquiler } from 'src/alquileres/alquiler.entity';

@Entity('reservas')
export class Reservas {
  @PrimaryGeneratedColumn('uuid')
  id_reserva: string;

  @ManyToOne(() => Vehiculo, vehiculo => vehiculo.reservas, { onDelete: 'CASCADE' })
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

  @ManyToOne(() => Cliente, (cliente) => cliente.reservas)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  
  @OneToMany(() => Factura, factura => factura.reserva)
  facturas: Factura[];

  @OneToMany(() => Pago, (pago) => pago.reserva)
  pagos: Pago[];

  
  @OneToOne(() => Alquiler, (alquiler) => alquiler.reserva)
  alquiler: Alquiler;
}