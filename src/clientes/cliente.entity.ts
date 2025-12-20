import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Reservas } from '../reservas/reservas.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id_cliente: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column()
  celular: string;

  @Column({ type: 'date' })
  fecha_nacimiento: Date;

  @Column()
  ciudad: string;

  
  @OneToOne(() => User, (user) => user.cliente, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Reservas, (reserva) => reserva.cliente)
  reservas: Reservas[];
}
