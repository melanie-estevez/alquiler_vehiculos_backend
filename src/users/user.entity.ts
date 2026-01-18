import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Cliente } from 'src/clientes/cliente.entity';
import { Role } from 'src/auth/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ unique: true })
  email: string;

  @Column({select:false})
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @OneToOne(() => Cliente, (cliente) => cliente.user, { nullable: true })
  cliente?: Cliente;
}