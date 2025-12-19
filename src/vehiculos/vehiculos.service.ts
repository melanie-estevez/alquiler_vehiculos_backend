import { Injectable } from '@nestjs/common';
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

  create(createVehiculoDto: CreateVehiculoDto) {
    const vehiculo = this.vehiculoRepository.create(createVehiculoDto);
    return this.vehiculoRepository.save(vehiculo);
  }


  findAll() {
    return this.vehiculoRepository.find();
  }

  findOne(id_vehiculo: string) {
    return this.vehiculoRepository.findOne({ where: { id_vehiculo } });
  }

  async update(id_vehiculo: string, updatevehiculoDto: UpdateVehiculoDto) {
    const vehiculo = await this.vehiculoRepository.findOne({ where: { id_vehiculo } });
    if (!vehiculo) return null;
    Object.assign(vehiculo, updatevehiculoDto);
    return this.vehiculoRepository.save(vehiculo);
  }

  async remove(id_vehiculo: string) {
    const vehiculo = await this.vehiculoRepository.findOne({ where: { id_vehiculo } });
    if (!vehiculo) return null;
    return this.vehiculoRepository.remove(vehiculo);
  }
}
