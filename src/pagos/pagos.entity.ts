import { Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';

@Entity('pago')
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id_pago: string;

  @Column()
  id_reserva: string;

  @Column()
  monto: number;

  @Column()
  metodo: string;

  @Column()
  estado: string;

  @Column()
  fecha_pago: Date;
}
