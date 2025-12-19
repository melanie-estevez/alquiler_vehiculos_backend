import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('alquiler')
export class Alquiler {
  @PrimaryGeneratedColumn('uuid')
  id_alquiler: string;

  @Column({ unique: true })
  id_reserva: string;

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

  @Column()
  pagos: Number;
}
