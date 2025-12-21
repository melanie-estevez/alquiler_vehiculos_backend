import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Reservas } from './reservas.entity';
import { Vehiculo } from '../vehiculos/vehiculos.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reservas)
    private readonly reservasRepository: Repository<Reservas>,

    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
  ) {}

  async create(dto: CreateReservaDto): Promise<Reservas> {
    try {
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

      return await this.reservasRepository.save(reserva);
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    queryDto: QueryDto,
  ): Promise<Pagination<Reservas>> {
    try {
      const { page, limit, search } = queryDto;

      const query = this.reservasRepository
        .createQueryBuilder('reserva')
        .leftJoinAndSelect('reserva.vehiculo', 'vehiculo');

      // 🔍 filtro simple
      if (search) {
        query.andWhere(
          `
          vehiculo.placa ILIKE :search
        `,
          { search: `%${search}%` },
        );
      }

      return await paginate<Reservas>(query, { page, limit });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Reservas> {
    try {
      const reserva = await this.reservasRepository.findOne({
        where: { id_reserva: id },
        relations: ['vehiculo'],
      });

      if (!reserva) {
        throw new NotFoundException(`Reserva ${id} no existe`);
      }

      return reserva;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: UpdateReservaDto): Promise<Reservas> {
    try {
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

      return await this.reservasRepository.save(reserva);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const reserva = await this.findOne(id);
      await this.reservasRepository.remove(reserva);
    } catch (error) {
      throw error;
    }
  }
}
