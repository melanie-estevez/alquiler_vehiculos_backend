import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './vehiculos.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Sucursales } from '../sucursales/sucursales.entity';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,

    @InjectRepository(Sucursales)
    private readonly sucursalRepository: Repository<Sucursales>,
  ) {}

  async create(dto: CreateVehiculoDto): Promise<Vehiculo> {
    const { id_sucursal, ...data } = dto;

    let sucursal: Sucursales | null = null;

    if (id_sucursal) {
      sucursal = await this.sucursalRepository.findOne({
        where: { id_sucursal },
      });

      if (!sucursal) {
        throw new NotFoundException('Sucursal no encontrada');
      }
    }

    const vehiculo = this.vehiculoRepository.create({
      ...data,
      sucursal,
    });

    return this.vehiculoRepository.save(vehiculo);
  }

  findAll(): Promise<Vehiculo[]> {
    return this.vehiculoRepository.find({
      relations: ['sucursal', 'reservas', 'mantenimientos'],
    });
  }

  async findOne(id: string): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findOne({
      where: { id_vehiculo: id },
      relations: ['sucursal', 'reservas', 'mantenimientos'],
    });

    if (!vehiculo) {
      throw new NotFoundException(`Vehículo ${id} no existe`);
    }

    return vehiculo;
  }

  async update(id: string, dto: UpdateVehiculoDto): Promise<Vehiculo> {
    const vehiculo = await this.findOne(id);
    const { id_sucursal, ...data } = dto;

    Object.assign(vehiculo, data);

    if (id_sucursal !== undefined) {
      if (id_sucursal === null) {
        vehiculo.sucursal = null;
      } else {
        const sucursal = await this.sucursalRepository.findOne({
          where: { id_sucursal },
        });

        if (!sucursal) {
          throw new NotFoundException('Sucursal no encontrada');
        }
        vehiculo.sucursal = sucursal;
      }
    }
    return this.vehiculoRepository.save(vehiculo);
  }

  async remove(id: string): Promise<void> {
    const vehiculo = await this.findOne(id);
    await this.vehiculoRepository.remove(vehiculo);
  }
}