import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    login: jest.fn(),
    register: jest.fn(),
  };

  const usersServiceMock = {
    createFirstAdminIfNone: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('devuelve SuccessResponseDto con "Login exitoso" y el access_token', async () => {
      const dto: any = { email: 'a@test.com', password: '123' };
      const result: any = { access_token: 'token-abc' };

      authServiceMock.login.mockResolvedValue(result);

      const respuesta: any = await controller.login(dto);

      expect(respuesta).toBeInstanceOf(SuccessResponseDto);
      expect(respuesta.message).toBe('Login exitoso');
      expect(respuesta.data).toEqual(result);
    });
  });

  describe('register', () => {
    it('devuelve SuccessResponseDto con "Usuario registrado correctamente" y el usuario', async () => {
      const dto: any = { email: 'a@test.com', password: '123' };
      const user: any = { id: 'U-1', email: 'a@test.com' };

      authServiceMock.register.mockResolvedValue(user);

      const respuesta: any = await controller.register(dto);

      expect(respuesta).toBeInstanceOf(SuccessResponseDto);
      expect(respuesta.message).toBe('Usuario registrado correctamente');
      expect(respuesta.data).toEqual(user);
    });
  });

  describe('bootstrapAdmin', () => {
    it('ejecuta bootstrap con admin@admin.com y admin12345 y devuelve SuccessResponseDto', async () => {
      const result: any = { message: 'Ya existe un admin, no se creó ninguno' };

      usersServiceMock.createFirstAdminIfNone.mockResolvedValue(result);

      const respuesta: any = await controller.bootstrapAdmin();

      expect(usersServiceMock.createFirstAdminIfNone).toHaveBeenCalledWith(
        'admin@admin.com',
        'admin12345',
      );

      expect(respuesta).toBeInstanceOf(SuccessResponseDto);
      expect(respuesta.message).toBe('Proceso de bootstrap ejecutado');
      expect(respuesta.data).toEqual(result);
    });
  });

  describe('me', () => {
    it('devuelve SuccessResponseDto con "Usuario autenticado" y el req.user', () => {
      const req: any = { user: { sub: 'U-1', email: 'a@test.com', role: 'USER' } };

      const respuesta: any = controller.me(req);

      expect(respuesta).toBeInstanceOf(SuccessResponseDto);
      expect(respuesta.message).toBe('Usuario autenticado');
      expect(respuesta.data).toEqual(req.user);
    });
  });
});
