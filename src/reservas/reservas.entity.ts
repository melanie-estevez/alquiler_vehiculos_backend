import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Vehiculo } from '../vehiculos/vehiculos.entity';
import { Cliente } from '../clientes/cliente.entity';
import { Pago } from '../pagos/pagos.entity';
import { EstadoReserva } from './enums/estado-reserva.enum';

@Entity('reservas')
export class Reservas {
  @PrimaryGeneratedColumn('uuid')
  id_reserva: string;

 // @ManyToOne(() => Cliente, (cliente) => cliente.reservas, {
 //  onDelete: 'CASCADE',
 // })

  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente |  null;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.reservas, {
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

 
  @OneToMany(() => Pago, (pago) => pago.reserva)
  pagos: Pago[];
}
