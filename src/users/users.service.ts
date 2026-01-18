import {Injectable, NotFoundException, BadRequestException, InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/auth/enums/role.enum';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private stripPassword(user: User) {
    if (!user) return user;
    const { password, ...rest } = user as any;
    return rest;
  }

  private handleDbError(error: any, fallbackMsg: string): never {
    if (error?.code === '23505') {
      throw new BadRequestException('El email ya está registrado');
    }
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException
    ) {
      throw error;
    }
    throw new InternalServerErrorException(fallbackMsg);
  }

 async findAll(queryDto: QueryDto): Promise<Pagination<User>> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;
      const qb = this.userRepository.createQueryBuilder('user');

      if (search) {
        if (searchField === 'email') {
          qb.andWhere('user.email ILIKE :search', { search: `%${search}%` });
        } else {
          qb.andWhere('user.email ILIKE :search', { search: `%${search}%` });
        }
      }
      if (sort) {
        qb.orderBy(`user.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<User>(qb, { page, limit });
    } catch (error) {
      throw this.handleDbError(error, 'Error al listar usuarios');
    }
  }

  async createFirstAdminIfNone(email: string, password: string) {
    try {
      const adminCount = await this.userRepository.count({
        where: { role: Role.ADMIN },
      });

      if (adminCount > 0) {
        return { message: 'Ya existe un admin, no se creó ninguno' };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const existing = await this.userRepository.findOne({ where: { email } });

      if (existing) {
        existing.role = Role.ADMIN;
        existing.password = hashedPassword;
        return this.stripPassword(await this.userRepository.save(existing));
      }

      const admin = this.userRepository.create({
        email,
        password: hashedPassword,
        role: Role.ADMIN,
      });

      return this.stripPassword(await this.userRepository.save(admin));
    } catch (error) {
      throw this.handleDbError(error, 'Error al crear admin');
    }
  }

  async create(dto: CreateUserDto) {
    try {
      const user = this.userRepository.create({
        email: dto.email,
        password: await bcrypt.hash(dto.password, 10),
        role: dto.role ?? Role.USER,
      });

      return this.stripPassword(await this.userRepository.save(user));
    } catch (error) {
      throw this.handleDbError(error, 'Error al crear usuario');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['cliente'],
      });

      if (!user) throw new NotFoundException('Usuario no encontrado');
      return this.stripPassword(user);
    } catch (error) {
      throw this.handleDbError(error, 'Error al obtener usuario');
    }
  }

  async findByEmailWithPassword(email: string) {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .getOne();
    } catch (error) {
      throw this.handleDbError(error, 'Error al buscar usuario');
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('Usuario no encontrado');

      if (dto.email !== undefined) user.email = dto.email;
      if (dto.password) user.password = await bcrypt.hash(dto.password, 10);
      if (dto.role) user.role = dto.role;

      return this.stripPassword(await this.userRepository.save(user));
    } catch (error) {
      throw this.handleDbError(error, 'Error al actualizar usuario');
    }
  }

  async updateRole(id: string, role: Role) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('Usuario no encontrado');

      user.role = role;
      return this.stripPassword(await this.userRepository.save(user));
    } catch (error) {
      throw this.handleDbError(error, 'Error al actualizar rol');
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('Usuario no encontrado');

      await this.userRepository.remove(user);
      return { message: 'Usuario eliminado' };
    } catch (error) {
      throw this.handleDbError(error, 'Error al eliminar usuario');
    }
  }
}