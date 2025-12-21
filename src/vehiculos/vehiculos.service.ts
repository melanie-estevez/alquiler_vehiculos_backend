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
    } catch (err) {
      console.error('Error creating vehiculo:', err);
      return null;
    }
  }


  async findAll(
    queryDto: QueryDto,
    estado?: string,
    idSucursal?: string,
  ): Promise<Pagination<Vehiculo> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.vehiculoRepository
        .createQueryBuilder('vehiculo')
        .leftJoinAndSelect('vehiculo.sucursal', 'sucursal');

      // filtro por estado
      if (estado) {
        query.andWhere('vehiculo.estado = :estado', { estado });
      }

      if (idSucursal) {
        query.andWhere('sucursal.id_sucursal = :idSucursal', {
          idSucursal,
        });
      }

     
      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'marca':
              query.andWhere('vehiculo.marca ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            case 'modelo':
              query.andWhere('vehiculo.modelo ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            case 'placa':
              query.andWhere('vehiculo.placa ILIKE :search', {
                search: `%${search}%`,
              });
              break;
            default:
              query.andWhere(
                '(vehiculo.marca ILIKE :search OR vehiculo.modelo ILIKE :search OR vehiculo.placa ILIKE :search)',
                { search: `%${search}%` },
              );
          }
        } else {
          query.andWhere(
            '(vehiculo.marca ILIKE :search OR vehiculo.modelo ILIKE :search OR vehiculo.placa ILIKE :search)',
            { search: `%${search}%` },
          );
        }
      }

     
      if (sort) {
        query.orderBy(
          `vehiculo.${sort}`,
          (order ?? 'ASC') as 'ASC' | 'DESC',
        );
      }

      return await paginate<Vehiculo>(query, { page, limit });
    } catch (err) {
      console.error('Error retrieving vehiculos:', err);
      return null;
    }
  }

  
  async findOne(id: string): Promise<Vehiculo | null> {
    try {
      return await this.vehiculoRepository.findOne({
        where: { id_vehiculo: id },
        relations: ['sucursal', 'reservas', 'mantenimientos'],
      });
    } catch (err) {
      console.error('Error finding vehiculo:', err);
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
    } catch (err) {
      console.error('Error updating vehiculo:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Vehiculo | null> {
    try {
      const vehiculo = await this.findOne(id);
      if (!vehiculo) return null;

      return await this.vehiculoRepository.remove(vehiculo);
    } catch (err) {
      console.error('Error deleting vehiculo:', err);
      return null;
    }
  }
}
