import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sucursales } from './sucursales.entity';
import { CreateSucursalesDto } from './dto/create-sucursales.dto';
import { UpdateSucursalesDto } from './dto/update-sucursales.dto';
import {
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class SucursalesService {
  constructor(
    @InjectRepository(Sucursales)
    private readonly sucursalRepository: Repository<Sucursales>,
  ) {}

  async create(dto: CreateSucursalesDto): Promise<Sucursales> {
    try {
      const sucursal = this.sucursalRepository.create(dto);
      return await this.sucursalRepository.save(sucursal);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al crear la sucursal',
      );
    }
  }

  async findAll(
    queryDto: QueryDto,
  ): Promise<Pagination<Sucursales>> {
    try {
      const { page, limit, search } = queryDto;

      const query = this.sucursalRepository
        .createQueryBuilder('sucursal')
        .leftJoinAndSelect('sucursal.vehiculos', 'vehiculos');

      // 🔍 filtro simple ?search=
      if (search) {
        query.andWhere(
          `(sucursal.nombre ILIKE :search 
            OR sucursal.ciudad ILIKE :search 
            OR sucursal.direccion ILIKE :search)`,
          { search: `%${search}%` },
        );
      }

      return await paginate<Sucursales>(query, {
        page,
        limit,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener las sucursales',
      );
    }
  }

  async findOne(id: string): Promise<Sucursales> {
    try {
      const sucursal = await this.sucursalRepository.findOne({
        where: { id_sucursal: id },
        relations: ['vehiculos'],
      });

      if (!sucursal) {
        throw new NotFoundException(
          `Sucursal ${id} no existe`,
        );
      }

      return sucursal;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al obtener la sucursal',
      );
    }
  }

  async update(
    id: string,
    dto: UpdateSucursalesDto,
  ): Promise<Sucursales> {
    try {
      const sucursal = await this.findOne(id);
      Object.assign(sucursal, dto);
      return await this.sucursalRepository.save(sucursal);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al actualizar la sucursal',
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const sucursal = await this.findOne(id);
      await this.sucursalRepository.remove(sucursal);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al eliminar la sucursal',
      );
    }
  }
}
