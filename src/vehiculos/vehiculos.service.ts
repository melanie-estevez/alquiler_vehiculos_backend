import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './vehiculos.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Sucursales } from '../sucursales/sucursales.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,

    @InjectRepository(Sucursales)
    private readonly sucursalRepository: Repository<Sucursales>,
  ) {}

  async create(dto: CreateVehiculoDto): Promise<Vehiculo | null> {
    try {
      const { id_sucursal, ...data } = dto;

      let sucursal: Sucursales | null = null;

      if (id_sucursal) {
        sucursal = await this.sucursalRepository.findOne({
          where: { id_sucursal },
        });
        if (!sucursal) return null;
      }

      const vehiculo = this.vehiculoRepository.create({
        ...data,
        sucursal,
      });

      return await this.vehiculoRepository.save(vehiculo);
    } catch (error) {
      console.error('Error creating vehiculo:', error);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Vehiculo> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.vehiculoRepository
        .createQueryBuilder('vehiculo')
        .leftJoinAndSelect('vehiculo.sucursal', 'sucursal');

  
      if (search && searchField === 'estado') {
        query.andWhere('vehiculo.estado = :estado', {
          estado: search,
        });
      }


      if (search && searchField === 'anio') {
        const anio = Number(search);
        if (!isNaN(anio)) {
          query.andWhere('vehiculo.anio = :anio', { anio });
        }
      }


      if (
        search &&
        searchField &&
        !['estado', 'anio'].includes(searchField)
      ) {
        query.andWhere(
          `vehiculo.${searchField} ILIKE :search`,
          { search: `%${search}%` },
        );
      }


      if (search && !searchField) {
        query.andWhere(
          `(vehiculo.marca ILIKE :search 
            OR vehiculo.modelo ILIKE :search 
            OR vehiculo.placa ILIKE :search)`,
          { search: `%${search}%` },
        );
      }


      if (sort) {
        query.orderBy(
          `vehiculo.${sort}`,
          (order ?? 'ASC') as 'ASC' | 'DESC',
        );
      }

      return await paginate<Vehiculo>(query, { page, limit });
    } catch (error) {
      console.error('Error retrieving vehiculos:', error);
      return null;
    }
  }

  async findOne(id: string): Promise<Vehiculo | null> {
    try {
      return await this.vehiculoRepository.findOne({
        where: { id_vehiculo: id },
        relations: ['sucursal', 'reservas', 'mantenimientos'],
      });
    } catch (error) {
      console.error('Error finding vehiculo:', error);
      return null;
    }
  }

  async update(
    id: string,
    dto: UpdateVehiculoDto,
  ): Promise<Vehiculo | null> {
    try {
      const vehiculo = await this.findOne(id);
      if (!vehiculo) return null;

      const { id_sucursal, ...data } = dto;
      Object.assign(vehiculo, data);

      if (id_sucursal !== undefined) {
        if (id_sucursal === null) {
          vehiculo.sucursal = null;
        } else {
          const sucursal = await this.sucursalRepository.findOne({
            where: { id_sucursal },
          });
          if (!sucursal) return null;
          vehiculo.sucursal = sucursal;
        }
      }

      return await this.vehiculoRepository.save(vehiculo);
    } catch (error) {
      console.error('Error updating vehiculo:', error);
      return null;
    }
  }

  async remove(id: string): Promise<Vehiculo | null> {
    try {
      const vehiculo = await this.findOne(id);
      if (!vehiculo) return null;

      return await this.vehiculoRepository.remove(vehiculo);
    } catch (error) {
      console.error('Error deleting vehiculo:', error);
      return null;
    }
  }
}
