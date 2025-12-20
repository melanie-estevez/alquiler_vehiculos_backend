import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  apellido: string;

  @Column({length:10})
  cedula:string;

  @Column()
  email: string;

  @Column()
  celular: string;

  @Column()
  fecha_nacimiento: string;

  @Column()
  licencia_conducir:boolean;

  @Column()
  ciudad: string;

  @OneToOne(() => User, user => user.cliente)
  @JoinColumn()
  user: User;
  facturas: any;

}
