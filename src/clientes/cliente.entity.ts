import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Factura } from 'src/facturas/factura.entity';
import { Reservas } from 'src/reservas/reservas.entity';

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
  
  @OneToMany(() => Factura, factura => factura.cliente)
  facturas: Factura[];

  @OneToMany(() => Reservas, (reservas) => reservas.cliente)
  reservas: Reservas[];
 
}
