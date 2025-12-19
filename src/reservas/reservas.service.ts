import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservas } from './reservas.entity';
import { Vehiculo } from '../vehiculos/vehiculos.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reservas)
    private readonly reservasRepository: Repository<Reservas>,

    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
  ) {}

  async create(dto: CreateReservaDto): Promise<Reservas> {
    const { id_vehiculo, ...data } = dto;

    const vehiculo = await this.vehiculoRepository.findOne({
      where: { id_vehiculo },
    });

    if (!vehiculo) {
      throw new NotFoundException(`Vehículo ${id_vehiculo} no existe`);
    }

    const reserva = this.reservasRepository.create({
      ...data,
      vehiculo,
    });

    return this.reservasRepository.save(reserva);
  }

  async findAll(): Promise<Reservas[]> {
    return this.reservasRepository.find({
      relations: ['vehiculo'],
    });
  }

  async findOne(id: string): Promise<Reservas> {
    const reserva = await this.reservasRepository.findOne({
      where: { id_reserva: id },
      relations: ['vehiculo'],
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva ${id} no existe`);
    }

    return reserva;
  }

  async update(id: string, dto: UpdateReservaDto): Promise<Reservas> {
    const reserva = await this.findOne(id);
    const { id_vehiculo, ...data } = dto;

    Object.assign(reserva, data);

    if (id_vehiculo !== undefined) {
      const vehiculo = await this.vehiculoRepository.findOne({
        where: { id_vehiculo },
      });

      if (!vehiculo) {
        throw new NotFoundException(`Vehículo ${id_vehiculo} no existe`);
      }

      reserva.vehiculo = vehiculo;
    }

    return this.reservasRepository.save(reserva);
  }

  async remove(id: string): Promise<void> {
    const reserva = await this.findOne(id);
    await this.reservasRepository.remove(reserva);
  }
}
