import { Test, TestingModule } from '@nestjs/testing';
import { ClientesService } from './clientes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { User } from 'src/users/user.entity';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));
import { paginate } from 'nestjs-typeorm-paginate';

describe('ClientesService', () => {
  let service: ClientesService;
  let clienteRepo: jest.Mocked<Repository<Cliente>>;
  let userRepo: jest.Mocked<Repository<User>>;

  const clienteRepoMock = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const userRepoMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        { provide: getRepositoryToken(Cliente), useValue: clienteRepoMock },
        { provide: getRepositoryToken(User), useValue: userRepoMock },
      ],
    }).compile();

    service = module.get<ClientesService>(ClientesService);
    clienteRepo = module.get(getRepositoryToken(Cliente));
    userRepo = module.get(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('debe crear una consulta con unión y paginación ', async () => {
      const qb: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      };

      clienteRepo.createQueryBuilder.mockReturnValue(qb);

      const queryDto: any = { page: 1, limit: 10, search: 'juan' };

      const paginationResult: any = {
        items: [{ id: 'c1' }],
        meta: {},
        links: {},
      };

      (paginate as jest.Mock).mockResolvedValue(paginationResult);

      const result = await service.findAll(queryDto);

      expect(clienteRepo.createQueryBuilder).toHaveBeenCalledWith('cliente');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('cliente.user', 'user');

      expect(qb.andWhere).toHaveBeenCalledTimes(1);
      expect(qb.andWhere.mock.calls[0][1]).toEqual({ search: '%juan%' });

      expect(paginate).toHaveBeenCalledWith(qb, { page: 1, limit: 10 });
      expect(result).toBe(paginationResult);
    });
  });

  describe('findByUserId', () => {
    it('debe devolver cliente si se encuentra', async () => {
      const cliente: any = { id: 'c1', name: 'Juan' };
      clienteRepo.findOne.mockResolvedValue(cliente);

      const result = await service.findByUserId('u1');

      expect(clienteRepo.findOne).toHaveBeenCalledWith({
        where: { user: { id: 'u1' } },
      });
      expect(result).toBe(cliente);
    });

    it('debería lanzar una excepción NotFoundException si no se encuentra el cliente.', async () => {
      clienteRepo.findOne.mockResolvedValue(null);

      await expect(service.findByUserId('u404')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('createForUser', () => {
    it('debería lanzar una excepción NotFoundException si el usuario no existe', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.createForUser('u1', { name: 'Juan' } as any),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: 'u1' } });
    });

    it('debería lanzar BadRequestException si el usuario ya tiene cliente', async () => {
      userRepo.findOne.mockResolvedValue({ id: 'u1' } as any);
      clienteRepo.findOne.mockResolvedValue({ id: 'c-existing' } as any);

      await expect(
        service.createForUser('u1', { name: 'Juan' } as any),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(clienteRepo.findOne).toHaveBeenCalledWith({
        where: { user: { id: 'u1' } },
      });
    });

    it('debe crear y guardar el cliente para el usuario', async () => {
      const user: any = { id: 'u1', email: 'x@test.com' };
      userRepo.findOne.mockResolvedValue(user);
      clienteRepo.findOne.mockResolvedValue(null);

      const dto: any = { name: 'Juan', apellido: 'Perez' };
      const entityToCreate: any = { ...dto, user };
      const saved: any = { id: 'c1', ...entityToCreate };

      clienteRepo.create.mockReturnValue(entityToCreate);
      clienteRepo.save.mockResolvedValue(saved);

      const result = await service.createForUser('u1', dto);

      expect(clienteRepo.create).toHaveBeenCalledWith({ ...dto, user });
      expect(clienteRepo.save).toHaveBeenCalledWith(entityToCreate);
      expect(result).toBe(saved);
    });
  });

  describe('create', () => {
    it('debería crear y guardar cliente', async () => {
      const dto: any = { name: 'Juan', apellido: 'Perez' };
      const entity: any = { ...dto };
      const saved: any = { id: 'c1', ...dto };

      clienteRepo.create.mockReturnValue(entity);
      clienteRepo.save.mockResolvedValue(saved);

      const result = await service.create(dto);

      expect(clienteRepo.create).toHaveBeenCalledWith(dto);
      expect(clienteRepo.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(saved);
    });
  });

  describe('findOne', () => {
    it('debería devolver cliente con relaciones', async () => {
      const cliente: any = { id: 'c1', user: { id: 'u1' } };
      clienteRepo.findOne.mockResolvedValue(cliente);

      const result = await service.findOne('c1');

      expect(clienteRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'c1' },
        relations: ['user'],
      });
      expect(result).toBe(cliente);
    });

    it('debería lanzar NotFoundException si no se encuentra', async () => {
      clienteRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('c404')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('debería lanzar una excepción NotFoundException si no se encuentra el cliente', async () => {
      clienteRepo.findOne.mockResolvedValue(null);

      await expect(service.update('c404', { name: 'x' } as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

  });

  describe('remove', () => {
    it('debería eliminar cliente y devolver el mensaje', async () => {
      const existing: any = { id: 'c1' };
      clienteRepo.findOne.mockResolvedValue(existing);
      clienteRepo.remove.mockResolvedValue(existing);

      const result = await service.remove('c1');

      expect(clienteRepo.remove).toHaveBeenCalledWith(existing);
      expect(result).toEqual({ message: 'Cliente eliminado' });
    });

    it('debería lanzar NotFoundException si no se encuentra el cliente', async () => {
      clienteRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('c404')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
