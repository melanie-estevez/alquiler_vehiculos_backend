import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Reservas } from 'src/reservas/reservas.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  apellido: string;

  @Column()
  email: string;

  @Column()
  celular: string;

  @Column()
  fecha_nacimiento: string;

  @Column()
  ciudad: string;

  @OneToOne(() => User, (user) => user.cliente, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

 
  @OneToMany(() => Reservas, (reserva) => reserva.cliente)
  reservas: Reservas[];
}
