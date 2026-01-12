import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    try {
      dto.role = Role.USER;
      return await this.usersService.create(dto);
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new BadRequestException('El email ya está registrado');
      }
      throw error; 
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.usersService.findByEmailWithPassword(dto.email);

      if (!user?.password) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const ok = await bcrypt.compare(dto.password, user.password);
      if (!ok) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      const access_token = await this.jwtService.signAsync(payload);

      return { access_token };
    } catch (error) {
      throw error;
    }
  }
}
