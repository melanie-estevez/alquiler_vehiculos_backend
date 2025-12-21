import {Injectable, NotFoundException, BadRequestException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { User } from 'src/users/user.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  
  async findAll(options: IPaginationOptions): Promise<Pagination<Cliente>> {
    const queryBuilder = this.clienteRepo.createQueryBuilder('cliente');
    return paginate<Cliente>(queryBuilder, options);
  }

  async findByUserId(userId: string) {
    const cliente = await this.clienteRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!cliente) {
      throw new NotFoundException('Este usuario no tiene cliente registrado');
    }

    return cliente;
  }

  async createForUser(userId: string, dto: CreateClienteDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no existe');

    const existing = await this.clienteRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (existing) {
      throw new BadRequestException('Este usuario ya tiene un cliente asociado');
    }

    const cliente = this.clienteRepo.create({
      ...dto,
      user,
    });

    return this.clienteRepo.save(cliente);
  }

  async create(dto: CreateClienteDto) {
    const cliente = this.clienteRepo.create(dto as any);
    return this.clienteRepo.save(cliente);
  }

  async findOne(id: string) {
    const cliente = await this.clienteRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  async update(id: string, dto: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    Object.assign(cliente, dto);
    return this.clienteRepo.save(cliente);
  }

  async remove(id: string) {
    const cliente = await this.findOne(id);
    await this.clienteRepo.remove(cliente);
    return { message: 'Cliente eliminado' };
  }
}