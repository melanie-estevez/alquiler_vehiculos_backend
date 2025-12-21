import { Reservas } from 'src/reservas/reservas.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('alquiler')
export class Alquiler {
  @PrimaryGeneratedColumn('uuid')
  id_alquiler: string;

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

  @OneToOne(() => Reservas, (reserva) => reserva.alquiler, )
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reservas;
}
