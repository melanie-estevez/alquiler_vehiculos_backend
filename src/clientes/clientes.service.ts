import {Injectable, NotFoundException, BadRequestException,InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { User } from 'src/users/user.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private handleDbError(error: any, msg: string): never {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException
    ) {
      throw error;
    }
    throw new InternalServerErrorException(msg);
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Cliente>> {
    try {
      const { page, limit, search } = queryDto;

      const qb = this.clienteRepo
        .createQueryBuilder('cliente')
        .leftJoinAndSelect('cliente.user', 'user');

      if (search) {
        qb.andWhere(
          `(
            user.email ILIKE :search
            OR cliente.name ILIKE :search
            OR cliente.apellido ILIKE :search
            OR cliente.cedula ILIKE :search
            OR cliente.email ILIKE :search
            OR cliente.celular ILIKE :search
            OR cliente.ciudad ILIKE :search
          )`,
          { search: `%${search}%` },
        );
      }

      return await paginate(qb, { page, limit });
    } catch (error) {
      throw this.handleDbError(error, 'Error al listar clientes');
    }
  }

  async findByUserId(userId: string) {
    try {
      const cliente = await this.clienteRepo.findOne({
        where: { user: { id: userId } },
      });

      if (!cliente) {
        throw new NotFoundException('Cliente no encontrado');
      }

      return cliente;
    } catch (error) {
      throw this.handleDbError(error, 'Error al buscar cliente');
    }
  }

  async createForUser(userId: string, dto: CreateClienteDto) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('Usuario no encontrado');

      const existing = await this.clienteRepo.findOne({
        where: { user: { id: userId } },
      });

      if (existing) {
        throw new BadRequestException('El usuario ya tiene cliente');
      }

      const cliente = this.clienteRepo.create({ ...dto, user });
      return await this.clienteRepo.save(cliente);
    } catch (error) {
      throw this.handleDbError(error, 'Error al crear cliente');
    }
  }

  async create(dto: CreateClienteDto) {
    try {
      const cliente = this.clienteRepo.create(dto as any);
      return await this.clienteRepo.save(cliente);
    } catch (error) {
      throw this.handleDbError(error, 'Error al crear cliente');
    }
  }

  async findOne(id: string) {
    try {
      const cliente = await this.clienteRepo.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!cliente) throw new NotFoundException('Cliente no encontrado');
      return cliente;
    } catch (error) {
      throw this.handleDbError(error, 'Error al obtener cliente');
    }
  }

  async update(id: string, dto: UpdateClienteDto) {
    try {
      const cliente = await this.findOne(id);
      Object.assign(cliente, dto);
      return await this.clienteRepo.save(cliente);
    } catch (error) {
      throw this.handleDbError(error, 'Error al actualizar cliente');
    }
  }

  async remove(id: string) {
    try {
      const cliente = await this.findOne(id);
      await this.clienteRepo.remove(cliente);
      return { message: 'Cliente eliminado' };
    } catch (error) {
      throw this.handleDbError(error, 'Error al eliminar cliente');
    }
  }
}
