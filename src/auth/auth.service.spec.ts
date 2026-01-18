import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Role } from 'src/auth/enums/role.enum';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    create: jest.fn(),
    findByEmailWithPassword: jest.fn(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('asigna role USER y registra al usuario usando UsersService', async () => {
      const dto: any = { email: 'a@test.com', password: '123', role: Role.ADMIN };

      const created: any = { id: 'U-1', email: 'a@test.com', role: Role.USER };
      usersServiceMock.create.mockResolvedValue(created);

      const result = await service.register(dto);
      expect(dto.role).toBe(Role.USER);
      expect(usersServiceMock.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(created);
    });

    it('si el email duplicado devuelve BadRequestException', async () => {
      const dto: any = { email: 'a@test.com', password: '123' };

      usersServiceMock.create.mockRejectedValue({ code: '23505' });

      await expect(service.register(dto)).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('login', () => {
    it('si no existe usuario o no trae password, rechaza con credenciales inválidas', async () => {
      usersServiceMock.findByEmailWithPassword.mockResolvedValue(null);

      await expect(service.login({ email: 'a@test.com', password: '123' } as any)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('si el password no coincide, rechaza con credenciales inválidas', async () => {
      const user: any = { id: 'U-1', email: 'a@test.com', role: Role.USER, password: 'hash' };
      usersServiceMock.findByEmailWithPassword.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ email: 'a@test.com', password: 'bad' } as any)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('si el password coincide, firma el JWT y devuelve access_token', async () => {
      const user: any = { id: 'U-1', email: 'a@test.com', role: Role.USER, password: 'hash' };
      usersServiceMock.findByEmailWithPassword.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jwtServiceMock.signAsync.mockResolvedValue('token-abc');

      const result = await service.login({ email: 'a@test.com', password: '123' } as any);

      expect(bcrypt.compare).toHaveBeenCalledWith('123', 'hash');
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        sub: 'U-1',
        email: 'a@test.com',
        role: Role.USER,
      });
      expect(result).toEqual({ access_token: 'token-abc' });
    });
  });
});
