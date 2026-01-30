import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
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

  private cleanDto(dto: any) {
    const clean = {
      name: dto?.name?.toString().trim(),
      apellido: dto?.apellido?.toString().trim(),
      cedula: dto?.cedula?.toString().trim(),
      email: dto?.email?.toString().trim(),
      celular: dto?.celular?.toString().trim(),
      fecha_nacimiento: dto?.fecha_nacimiento?.toString().trim(),
      licencia_conducir:
        dto?.licencia_conducir === true ||
        dto?.licencia_conducir === 'true' ||
        dto?.licencia_conducir === 1 ||
        dto?.licencia_conducir === '1',
      ciudad: dto?.ciudad?.toString().trim(),
    };

    Object.keys(clean).forEach((k) => {
      const key = k as keyof typeof clean;
      if (
        clean[key] === undefined ||
        clean[key] === null ||
        clean[key] === ''
      ) {
        delete (clean as any)[key];
      }
    });

    return clean;
  }

  private validateRequiredForCreate(clean: any) {
    const required = [
      'name',
      'apellido',
      'cedula',
      'email',
      'celular',
      'fecha_nacimiento',
      'licencia_conducir',
      'ciudad',
    ];
    const missing = required.filter((k) => clean?.[k] === undefined);
    if (missing.length) {
      throw new BadRequestException(
        `Faltan campos obligatorios: ${missing.join(', ')}`,
      );
    }
    if (typeof clean.cedula === 'string' && clean.cedula.length !== 10) {
      throw new BadRequestException('La cédula debe tener 10 dígitos');
    }
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
            cliente.id::text ILIKE :search
            OR cliente.name ILIKE :search
            OR cliente.apellido ILIKE :search
            OR cliente.cedula ILIKE :search
            OR cliente.email ILIKE :search
            OR cliente.celular ILIKE :search
            OR cliente.ciudad ILIKE :search
            OR user.email ILIKE :search
          )`,
          { search: `%${search}%` },
        );
      }

      return await paginate(qb, { page, limit });
    } catch (error) {
      throw this.handleDbError(error, 'Error al listar clientes');
    }
  }

  async findOne(id: string): Promise<Cliente> {
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

  async getMe(userId: string): Promise<Cliente> {
    try {
      const cliente = await this.clienteRepo.findOne({
        where: { user: { id: userId } } as any,
        relations: ['user'],
      });
      if (!cliente) throw new NotFoundException('Cliente no encontrado');
      return cliente;
    } catch (error) {
      throw this.handleDbError(error, 'Error al obtener perfil de cliente');
    }
  }

  async upsertMe(userId: string, dto: any): Promise<Cliente> {
    try {
      const clean = this.cleanDto(dto);

      const exists = await this.clienteRepo.findOne({
        where: { user: { id: userId } } as any,
        relations: ['user'],
      });

      if (exists) {
        Object.assign(exists, clean);
        return await this.clienteRepo.save(exists);
      }

      this.validateRequiredForCreate(clean);

      const cliente = this.clienteRepo.create({
        ...clean,
        user: { id: userId } as any,
      });

      return await this.clienteRepo.save(cliente);
    } catch (error) {
      throw this.handleDbError(error, 'Error al guardar perfil de cliente');
    }
  }

  async update(id: string, dto: any): Promise<Cliente> {
    try {
      const cliente = await this.findOne(id);
      const clean = this.cleanDto(dto);
      Object.assign(cliente, clean);
      return await this.clienteRepo.save(cliente);
    } catch (error) {
      throw this.handleDbError(error, 'Error al actualizar cliente');
    }
  }

  async remove(id: string) {
    try {
      const cliente = await this.findOne(id);
      await this.clienteRepo.remove(cliente);
      return { message: 'Cliente eliminado correctamente' };
    } catch (error) {
      throw this.handleDbError(error, 'Error al eliminar cliente');
    }
  }
}
