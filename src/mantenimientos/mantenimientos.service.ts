import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Mantenimiento } from './mantenimientos.entity';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import { MantenimientoQueryDto } from './dto/mantenimiento-query.dto';
import { Vehiculo } from '../vehiculos/vehiculos.entity';

@Injectable()
export class MantenimientoService {
  constructor(
    @InjectRepository(Mantenimiento)
    private readonly mantenimientoRepo: Repository<Mantenimiento>,

    @InjectRepository(Vehiculo)
    private readonly vehiculoRepo: Repository<Vehiculo>,
  ) {}

  async create(dto: CreateMantenimientoDto): Promise<Mantenimiento> {
    const vehiculo = await this.vehiculoRepo.findOne({
      where: { id_vehiculo: dto.id_vehiculo },
    });

    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');

    const mantenimiento = this.mantenimientoRepo.create({
      ...dto,
      vehiculo,
    });

    return this.mantenimientoRepo.save(mantenimiento);
  }

  async findAll(query: MantenimientoQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = query.search
      ? [
          { observaciones: ILike(`%${query.search}%`) },
          { estado_revision: ILike(`%${query.search}%`) },
        ]
      : {};

    const [result, total] = await this.mantenimientoRepo.findAndCount({
      where,
      take: limit,
      skip,
      order: { fecha_revision: 'DESC' },
    });

    return {
      data: result,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Mantenimiento> {
    const mantenimiento = await this.mantenimientoRepo.findOne({
      where: { id_mantenimiento: id },
    });

    if (!mantenimiento)
      throw new NotFoundException(`Mantenimiento ${id} no existe`);

    return mantenimiento;
  }

  async update(id: string, dto: UpdateMantenimientoDto) {
    const mantenimiento = await this.findOne(id);

    Object.assign(mantenimiento, dto);

    return this.mantenimientoRepo.save(mantenimiento);
  }

  async remove(id: string): Promise<void> {
    const mantenimiento = await this.findOne(id);
    await this.mantenimientoRepo.remove(mantenimiento);
  }
}
