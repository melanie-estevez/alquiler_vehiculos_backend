import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './vehiculos.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
  ) {}

  async create(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    const { id_sucursal, ...resto } = createVehiculoDto;

    const vehiculo = this.vehiculoRepository.create({
      ...resto,
      id_sucursal: id_sucursal
        ? ({ id_sucursales: id_sucursal } as any)
        : undefined,
    });

    return this.vehiculoRepository.save(vehiculo);
  }

  findAll(): Promise<Vehiculo[]> {
    return this.vehiculoRepository.find({
      relations: ['id_sucursal', 'id_reservas', 'id_mantenimientos'],
    });
  }

  async findOne(id_vehiculo: string): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findOne({
      where: { id_vehiculo },
      relations: ['id_sucursal', 'id_reservas', 'id_mantenimientos'],
    });

    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con id ${id_vehiculo} no existe`);
    }

    return vehiculo;
  }

  async update(
    id_vehiculo: string,
    updateVehiculoDto: UpdateVehiculoDto,
  ): Promise<Vehiculo> {
    const vehiculo = await this.findOne(id_vehiculo);

    const { id_sucursal, ...resto } = updateVehiculoDto;

    Object.assign(vehiculo, resto);

    if (id_sucursal !== undefined) {
      vehiculo.id_sucursal = id_sucursal
        ? ({ id_sucursales: id_sucursal } as any)
        : undefined;
    }

    return this.vehiculoRepository.save(vehiculo);
  }

  async remove(id_vehiculo: string): Promise<void> {
    const vehiculo = await this.findOne(id_vehiculo);
    await this.vehiculoRepository.remove(vehiculo);
  }
}
