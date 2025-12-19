import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sucursales } from './sucursales.entity';
import { CreateSucursalesDto } from './dto/create-sucursales.dto';
import { UpdateSucursalesDto } from './dto/update-sucursales.dto';

@Injectable()
export class SucursalesService {
  constructor(
    @InjectRepository(Sucursales)
    private readonly sucursalRepository: Repository<Sucursales>,
  ) {}

  async create(dto: CreateSucursalesDto): Promise<Sucursales> {
    const sucursal = this.sucursalRepository.create(dto);
    return this.sucursalRepository.save(sucursal);
  }

  async findAll(): Promise<Sucursales[]> {
    return this.sucursalRepository.find({
      relations: ['vehiculo'], 
    });
  }

  async findOne(id: string): Promise<Sucursales> {
    const sucursal = await this.sucursalRepository.findOne({
      where: { id_sucursal: id },
      relations: ['vehiculo'],
    });

    if (!sucursal) {
      throw new NotFoundException(`Sucursal ${id} no existe`);
    }

    return sucursal;
  }

  async update(
    id: string,
    dto: UpdateSucursalesDto,
  ): Promise<Sucursales> {
    const sucursal = await this.findOne(id);
    Object.assign(sucursal, dto);
    return this.sucursalRepository.save(sucursal);
  }

  async remove(id: string): Promise<void> {
    const sucursal = await this.findOne(id);
    await this.sucursalRepository.remove(sucursal);
  }
}
