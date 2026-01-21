import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from 'src/auth/enums/role.enum';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));
import * as bcrypt from 'bcrypt';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));
import { paginate } from 'nestjs-typeorm-paginate';

describe('UsersService', () => {
  let service: UsersService;

  const userRepoMock = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepoMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('aplica búsqueda por email, ordenamiento y pagina resultados', async () => {
      const qb: any = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      };

      userRepoMock.createQueryBuilder.mockReturnValue(qb);

      const queryDto: any = {
        page: 1,
        limit: 10,
        search: 'test',
        searchField: 'email',
        sort: 'email',
        order: 'DESC',
      };

      const paginado: any = { items: [{ id: '1', email: 'a@test.com' }], meta: {}, links: {} };
      (paginate as jest.Mock).mockResolvedValue(paginado);

      const result = await service.findAll(queryDto);

      expect(userRepoMock.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(qb.andWhere).toHaveBeenCalledWith('user.email ILIKE :search', {
        search: '%test%',
      });
      expect(qb.orderBy).toHaveBeenCalledWith('user.email', 'DESC');
      expect(paginate).toHaveBeenCalledWith(qb, { page: 1, limit: 10 });
      expect(result).toBe(paginado);
    });
  });

  describe('create', () => {
    it('crea un usuario, hashea el password y no devuelve el password en la respuesta', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-123');

      const dto: any = { email: 'a@test.com', password: '123', role: Role.USER };

      const entityCreada: any = {
        email: dto.email,
        password: 'hashed-123',
        role: Role.USER,
      };

      const guardado: any = { id: '1', ...entityCreada };

      userRepoMock.create.mockReturnValue(entityCreada);
      userRepoMock.save.mockResolvedValue(guardado);

      const result: any = await service.create(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
      expect(userRepoMock.create).toHaveBeenCalledWith({
        email: dto.email,
        password: 'hashed-123',
        role: Role.USER,
      });
      expect(result.password).toBeUndefined();
      expect(result.email).toBe('a@test.com');
    });

    it('si el email está duplicado, devuelve BadRequestException', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-123');

      userRepoMock.create.mockReturnValue({} as any);
      userRepoMock.save.mockRejectedValue({ code: '23505' });

      await expect(service.create({ email: 'a@test.com', password: '123' } as any)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('createFirstAdminIfNone', () => {
    it('si ya existe un admin, no crea otro y devuelve el mensaje', async () => {
      userRepoMock.count.mockResolvedValue(1);

      const result = await service.createFirstAdminIfNone('admin@test.com', '123');

      expect(userRepoMock.count).toHaveBeenCalledWith({ where: { role: Role.ADMIN } });
      expect(result).toEqual({ message: 'Ya existe un admin, no se creó ninguno' });
    });

    it('si no existe admin, crea uno nuevo con role ADMIN y sin password en la respuesta', async () => {
      userRepoMock.count.mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-admin');

      userRepoMock.findOne.mockResolvedValue(null);

      const adminEntity: any = {
        email: 'admin@test.com',
        password: 'hashed-admin',
        role: Role.ADMIN,
      };

      userRepoMock.create.mockReturnValue(adminEntity);
      userRepoMock.save.mockResolvedValue({ id: 'A1', ...adminEntity });

      const result: any = await service.createFirstAdminIfNone('admin@test.com', '123');

      expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
      expect(userRepoMock.create).toHaveBeenCalledWith({
        email: 'admin@test.com',
        password: 'hashed-admin',
        role: Role.ADMIN,
      });

      expect(result.password).toBeUndefined();
      expect(result.role).toBe(Role.ADMIN);
    });
  });

  describe('findOne', () => {
    it('si el usuario no existe, lanza NotFoundException', async () => {
      userRepoMock.findOne.mockResolvedValue(null);

      await expect(service.findOne('U-404')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('si existe, devuelve el usuario sin password', async () => {
      userRepoMock.findOne.mockResolvedValue({
        id: 'U-1',
        email: 'a@test.com',
        password: 'hashed',
        role: Role.USER,
      });

      const result: any = await service.findOne('U-1');

      expect(result.password).toBeUndefined();
      expect(result.email).toBe('a@test.com');
    });
  });

  describe('update', () => {
    it('si el usuario no existe, lanza NotFoundException', async () => {
      userRepoMock.findOne.mockResolvedValue(null);

      await expect(service.update('U-404', { email: 'x@test.com' } as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('si llega password, lo hashea y no devuelve password en la respuesta', async () => {
      const userExistente: any = {
        id: 'U-1',
        email: 'a@test.com',
        password: 'old-hash',
        role: Role.USER,
      };

      userRepoMock.findOne.mockResolvedValue(userExistente);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hash');

      userRepoMock.save.mockImplementation(async (u: any) => u);

      const result: any = await service.update('U-1', { password: 'new123' } as any);

      expect(bcrypt.hash).toHaveBeenCalledWith('new123', 10);
      expect(userExistente.password).toBe('new-hash');
      expect(result.password).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('si el usuario no existe, lanza NotFoundException', async () => {
      userRepoMock.findOne.mockResolvedValue(null);

      await expect(service.remove('U-404')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});