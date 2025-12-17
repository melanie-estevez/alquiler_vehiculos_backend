import { Entity, Column, PrimaryGeneratedColumn  } 
from 'typeorm';

@Entity('vehiculo')
export class Vehiculo {
  @PrimaryGeneratedColumn('uuid')
  id_vehiculo: string;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column()
  anio: number;

  @Column()
  placa: string;

  @Column()
  precio_diario: number;
  
  @Column()
  estado: string;

}
