import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mantenimiento } from './mantenimientos.entity';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import { Vehiculo } from '../vehiculos/vehiculos.entity';

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

  async findAll(): Promise<Mantenimiento[]> {
    return this.mantenimientoRepository.find({
      relations: ['vehiculo'],
    });
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