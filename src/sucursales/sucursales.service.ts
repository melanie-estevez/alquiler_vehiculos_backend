import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Sucursales } from './sucursales.entity';
import { CreateSucursalesDto } from './dto/create-sucursales.dto';
import { UpdateSucursalesDto } from './dto/update-sucursales.dto';
import { Vehiculo } from '../vehiculos/vehiculos.entity';

@Injectable()
export class SucursalesService {
  constructor(
    @InjectRepository(Sucursales)
    private readonly sucursalRepository: Repository<Sucursales>,

    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
  ) {}

  async create(dto: CreateSucursalesDto): Promise<Sucursales> {
    const { id_vehiculo, ...data } = dto;

    const sucursal = this.sucursalRepository.create(data);
    const guardada = await this.sucursalRepository.save(sucursal);

    if (id_vehiculo?.length) {
      await this.vehiculoRepository.update(
        { id_vehiculo: In(id_vehiculo) },
        { id_sucursal: { id_sucursal: guardada.id_sucursal } }
      );
    }

    return this.findOne(guardada.id_sucursal);
  }

  async findAll() {
    return this.sucursalRepository.find({
      relations: ['id_vehiculo'],
    });
  }

  async findOne(id: string) {
    const sucursal = await this.sucursalRepository.findOne({
      where: { id_sucursal: id },
      relations: ['id_vehiculo'],
    });

    if (!sucursal) {
      throw new NotFoundException(`Sucursal ${id} no existe`);
    }

    return sucursal;
  }

  async update(id: string, dto: UpdateSucursalesDto) {
    const { id_vehiculo, ...data } = dto;

    const sucursal = await this.findOne(id);
    Object.assign(sucursal, data);
    await this.sucursalRepository.save(sucursal);

    if (id_vehiculo?.length) {
      await this.vehiculoRepository.update(
        { id_vehiculo: In(id_vehiculo) },
        { id_sucursal: { id_sucursal: id } }
      );
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.sucursalRepository.delete(id);
  }
}
