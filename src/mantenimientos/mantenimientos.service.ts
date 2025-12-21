import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { Mantenimiento } from './mantenimientos.entity';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import { Vehiculo } from '../vehiculos/vehiculos.entity';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class MantenimientoService {
  constructor(
    @InjectRepository(Mantenimiento)
    private readonly mantenimientoRepository: Repository<Mantenimiento>,

    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
  ) {}

  async create(dto: CreateMantenimientoDto): Promise<Mantenimiento> {
    const { id_vehiculo, ...data } = dto;

    const vehiculo = await this.vehiculoRepository.findOne({
      where: { id_vehiculo },
    });

    if (!vehiculo) {
      throw new NotFoundException(`Vehículo ${id_vehiculo} no existe`);
    }

    const mantenimiento = this.mantenimientoRepository.create({
      ...data,
      vehiculo,
    });

    return this.mantenimientoRepository.save(mantenimiento);
  }

  // 🔥 AQUÍ EL CAMBIO IMPORTANTE
  async findAll(
    queryDto: QueryDto,
  ): Promise<Pagination<Mantenimiento>> {
    try {
      const { page, limit, search, sort, order } = queryDto;

      const query = this.mantenimientoRepository
        .createQueryBuilder('mantenimiento')
        .leftJoinAndSelect('mantenimiento.vehiculo', 'vehiculo');

      // 🔍 SEARCH SIMPLE
      if (search) {
        query.andWhere(
          '(vehiculo.placa ILIKE :search OR mantenimiento.observaciones ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      // 🔃 SORT SIMPLE
      if (sort) {
        query.orderBy(
          `mantenimiento.${sort}`,
          (order ?? 'DESC') as 'ASC' | 'DESC',
        );
      }

      return await paginate<Mantenimiento>(query, { page, limit });
    } catch (err) {
      console.error('Error obteniendo mantenimientos:', err);
      throw err;
    }
  }

  async findOne(id_mantenimiento: string): Promise<Mantenimiento> {
    const mantenimiento = await this.mantenimientoRepository.findOne({
      where: { id_mantenimiento },
      relations: ['vehiculo'],
    });

    if (!mantenimiento) {
      throw new NotFoundException(
        `Mantenimiento ${id_mantenimiento} no existe`,
      );
    }

    return mantenimiento;
  }

  async update(
    id_mantenimiento: string,
    dto: UpdateMantenimientoDto,
  ): Promise<Mantenimiento> {
    const mantenimiento = await this.findOne(id_mantenimiento);
    const { id_vehiculo, ...data } = dto;

    Object.assign(mantenimiento, data);

    if (id_vehiculo !== undefined) {
      const vehiculo = await this.vehiculoRepository.findOne({
        where: { id_vehiculo },
      });

      if (!vehiculo) {
        throw new NotFoundException(`Vehículo ${id_vehiculo} no existe`);
      }

      mantenimiento.vehiculo = vehiculo;
    }

    return this.mantenimientoRepository.save(mantenimiento);
  }

  async remove(id_mantenimiento: string): Promise<void> {
    const mantenimiento = await this.findOne(id_mantenimiento);
    await this.mantenimientoRepository.remove(mantenimiento);
  }
}
