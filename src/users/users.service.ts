import {Injectable, NotFoundException,BadRequestException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/auth/enums/role.enum';

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

  private stripPasswordMany(users: User[]) {
    return users.map((u) => this.stripPassword(u));
  }


  async createFirstAdminIfNone(email: string, password: string) {
    const adminCount = await this.userRepository.count({
      where: { role: Role.ADMIN },
    });

    if (adminCount > 0) {
      return { message: 'Ya existe un admin, no se creó ninguno' };
    }

    const existing = await this.userRepository.findOne({
      where: { email },
    });

    if (existing) {
      existing.role = Role.ADMIN;
      existing.password = await bcrypt.hash(password, 10);
      const saved = await this.userRepository.save(existing);
      return this.stripPassword(saved);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = this.userRepository.create({
      email,
      password: hashedPassword,
      role: Role.ADMIN,
    });

    const saved = await this.userRepository.save(admin);
    return this.stripPassword(saved);
  }


  async create(dto: CreateUserDto) {
    const exists = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (exists) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      role: dto.role ?? Role.USER,
    });

    const saved = await this.userRepository.save(user);
    return this.stripPassword(saved);
  }


  async findAll() {
    const users = await this.userRepository.find({
      relations: ['cliente'],
    });
    return this.stripPasswordMany(users);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['cliente'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.stripPassword(user);
  }

  async findByEmailWithPassword(email: string) {
  return this.userRepository
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email', { email })
    .getOne();
  }


  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (dto.email !== undefined) {
      const exists = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (exists && exists.id !== id) {
        throw new BadRequestException('El email ya está registrado');
      }

      user.email = dto.email;
    }

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.role) {
      user.role = dto.role;
    }

    const saved = await this.userRepository.save(user);
    return this.stripPassword(saved);
  }

  async updateRole(id: string, role: Role) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.role = role;
    const saved = await this.userRepository.save(user);
    return this.stripPassword(saved);
  }


  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.userRepository.remove(user);
    return { message: 'Usuario eliminado' };
  }
}
