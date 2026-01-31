import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculos } from './vehiculos.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Sucursales } from '../sucursales/sucursales.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { EstadoVehiculo } from './enums/estado-vehiculo.enum';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculos)
    private readonly vehiculoRepository: Repository<Vehiculos>,
    @InjectRepository(Sucursales)
    private readonly sucursalRepository: Repository<Sucursales>,
  ) {}

  async create(dto: CreateVehiculoDto): Promise<Vehiculos | null> {
    try {
      const { id_sucursal, ...data } = dto as any;

      let sucursal: Sucursales | null = null;

      if (id_sucursal) {
        sucursal = await this.sucursalRepository.findOne({
          where: { id_sucursal },
        });
        if (!sucursal) return null;
      }

      const payload = {
        ...data,
        sucursal: sucursal ?? null,
        imagen_url: (dto as any).imagen_url ?? null,
      } as unknown as Vehiculos;

      const vehiculo = this.vehiculoRepository.create(payload);
      return (await this.vehiculoRepository.save(
        vehiculo as unknown as Vehiculos,
      )) as Vehiculos;
    } catch (error) {
      console.error('Error creating vehiculo:', error);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Vehiculos> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto as any;

      const query = this.vehiculoRepository
        .createQueryBuilder('vehiculo')
        .leftJoinAndSelect('vehiculo.sucursal', 'sucursal');

      if (search && searchField === 'estado') {
        query.andWhere('vehiculo.estado = :estado', { estado: search });
      }

      if (search && searchField === 'anio') {
        const anio = Number(search);
        if (!isNaN(anio)) query.andWhere('vehiculo.anio = :anio', { anio });
      }

      if (search && searchField && !['estado', 'anio'].includes(searchField)) {
        query.andWhere(`vehiculo.${searchField} ILIKE :search`, {
          search: `%${search}%`,
        });
      }

      if (search && !searchField) {
        query.andWhere(
          `(vehiculo.marca ILIKE :search OR vehiculo.modelo ILIKE :search OR vehiculo.placa ILIKE :search)`,
          { search: `%${search}%` },
        );
      }

      if (sort) {
        query.orderBy(
          `vehiculo.${sort}`,
          (order ?? 'ASC') as 'ASC' | 'DESC',
        );
      }

      return await paginate<Vehiculos>(query, { page, limit });
    } catch (error) {
      console.error('Error retrieving vehiculos:', error);
      return null;
    }
  }

  async findOne(id: string): Promise<Vehiculos | null> {
    try {
      return (await this.vehiculoRepository.findOne({
        where: { id_vehiculo: id } as any,
        relations: ['sucursal', 'reservas', 'mantenimientos'],
      })) as Vehiculos | null;
    } catch (error) {
      console.error('Error finding vehiculo:', error);
      return null;
    }
  }

  async update(id: string, dto: UpdateVehiculoDto): Promise<Vehiculos | null> {
    try {
      const vehiculo = await this.findOne(id);
      if (!vehiculo) return null;

      const { id_sucursal, ...data } = dto as any;
      Object.assign(vehiculo as any, data);

      if ((dto as any).imagen_url !== undefined) {
        (vehiculo as any).imagen_url = (dto as any).imagen_url ?? null;
      }

      if (id_sucursal !== undefined) {
        if (id_sucursal === null) {
          (vehiculo as any).sucursal = null;
        } else {
          const sucursal = await this.sucursalRepository.findOne({
            where: { id_sucursal },
          });
          if (!sucursal) return null;
          (vehiculo as any).sucursal = sucursal;
        }
      }

      return (await this.vehiculoRepository.save(
        vehiculo as unknown as Vehiculos,
      )) as Vehiculos;
    } catch (error) {
      console.error('Error updating vehiculo:', error);
      return null;
    }
  }

  async remove(id: string): Promise<Vehiculos | null> {
    try {
      const vehiculo = await this.vehiculoRepository.findOne({
        where: { id_vehiculo: id } as any,
      });
      if (!vehiculo) return null;

      await this.vehiculoRepository.delete({ id_vehiculo: id } as any);
      return vehiculo as Vehiculos;
    } catch (error) {
      console.error('Error deleting vehiculo:', error);
      return null;
    }
  }

  async updateEstado(
    id: string,
    estado: EstadoVehiculo,
  ): Promise<Vehiculos | null> {
    try {
      if (!Object.values(EstadoVehiculo).includes(estado as any)) return null;

      const vehiculo = await this.findOne(id);
      if (!vehiculo) return null;

      (vehiculo as any).estado = estado;

      return (await this.vehiculoRepository.save(
        vehiculo as unknown as Vehiculos,
      )) as Vehiculos;
    } catch (error) {
      console.error('Error updating estado vehiculo:', error);
      return null;
    }
  }

  async updateImagenUrl(
    id: string,
    imagen_url: string | null,
  ): Promise<Vehiculos | null> {
    try {
      const vehiculo = await this.findOne(id);
      if (!vehiculo) return null;

      (vehiculo as any).imagen_url = imagen_url ?? null;

      return (await this.vehiculoRepository.save(
        vehiculo as unknown as Vehiculos,
      )) as Vehiculos;
    } catch (error) {
      console.error('Error updating imagen_url vehiculo:', error);
      return null;
    }
  }
}
