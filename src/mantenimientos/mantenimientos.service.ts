import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mantenimiento } from './mantenimientos.entity';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';

@Injectable()
export class MantenimientoService {
  constructor(
    @InjectRepository(Mantenimiento)
    private readonly mantenimientoRepository: Repository<Mantenimiento>,
  ) {}

  create(dto: CreateMantenimientoDto) {
   
    const mantenimiento = this.mantenimientoRepository.create({
      ...dto,
      id_vehiculo: { id_vehiculo: dto.id_vehiculo },
    });

    return this.mantenimientoRepository.save(mantenimiento);
  }

  findAll() {
    return this.mantenimientoRepository.find();
  }

  findOne(id_mantenimiento: string) {
    return this.mantenimientoRepository.findOne({
      where: { id_mantenimiento },
    });
  }

  async update(id_mantenimiento: string, dto: UpdateMantenimientoDto) {
    const mantenimiento = await this.mantenimientoRepository.findOne({
      where: { id_mantenimiento },
    });

    if (!mantenimiento) return null;

    // Si cambia el vehículo, convertir FK
    if (dto.id_vehiculo) {
      mantenimiento.id_vehiculo = { id_vehiculo: dto.id_vehiculo } as any;
    }

    Object.assign(mantenimiento, dto);

    return this.mantenimientoRepository.save(mantenimiento);
  }

  async remove(id_mantenimiento: string) {
    const mantenimiento = await this.mantenimientoRepository.findOne({
      where: { id_mantenimiento },
    });

    if (!mantenimiento) return null;

    return this.mantenimientoRepository.remove(mantenimiento);
  }
}
