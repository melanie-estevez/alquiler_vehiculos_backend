jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { SucursalesService } from './sucursales.service';
import { Sucursales } from './sucursales.entity';
import { QueryDto } from 'src/common/dto/query.dto';

describe('SucursalesService', () => {
  let service: SucursalesService;
  let repo: jest.Mocked<Repository<Sucursales>>;
  let qb: Partial<SelectQueryBuilder<Sucursales>>;


  const baseSucursal: Partial<Sucursales> = {
    id_sucursal: 'suc-1',
    nombre: 'Sucursal Centro',
    ciudad: 'Quito',
    direccion: 'Av. Siempre Viva',
    vehiculos: [],
  };

  beforeEach(async () => {
    qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
    };

    repo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SucursalesService,
        {
          provide: getRepositoryToken(Sucursales),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<SucursalesService>(SucursalesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear una sucursal', async () => {
      repo.create.mockReturnValue(baseSucursal as Sucursales);
      repo.save.mockResolvedValue(baseSucursal as Sucursales);

      const result = await service.create(baseSucursal as any);

      expect(repo.create).toHaveBeenCalledWith(baseSucursal);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(baseSucursal);
    });

    it('debe lanzar error si falla', async () => {
      repo.create.mockImplementation(() => {
        throw new Error();
      });

      await expect(
        service.create({} as any),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });


  describe('findAll', () => {
    it('debe retornar sucursales paginadas', async () => {
      const query: QueryDto = {
        page: 1,
        limit: 10,
        search: 'Quito',
      };

      const paginated: Pagination<Sucursales> = {
        items: [baseSucursal as Sucursales],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        } as any,
        links: {} as any,
      };

      (paginate as jest.Mock).mockResolvedValue(paginated);

      const result = await service.findAll(query);

      expect(repo.createQueryBuilder).toHaveBeenCalledWith('sucursal');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        'sucursal.vehiculos',
        'vehiculos',
      );
      expect(qb.andWhere).toHaveBeenCalled();
      expect(result).toEqual(paginated);
    });

    it('debe lanzar error si falla', async () => {
      repo.createQueryBuilder.mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(
        service.findAll({ page: 1, limit: 10 } as any),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });


  describe('findOne', () => {
    it('debe retornar una sucursal', async () => {
      repo.findOne.mockResolvedValue(baseSucursal as Sucursales);

      const result = await service.findOne('suc-1');

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id_sucursal: 'suc-1' },
        relations: ['vehiculos'],
      });
      expect(result).toEqual(baseSucursal);
    });

    it('debe lanzar NotFound si no existe', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('no-existe'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });


  describe('update', () => {
    it('debe actualizar sucursal', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(baseSucursal as Sucursales);

      repo.save.mockResolvedValue({
        ...baseSucursal,
        nombre: 'Nueva',
      } as Sucursales);

      const result = await service.update('suc-1', {
        nombre: 'Nueva',
      } as any);

      expect(repo.save).toHaveBeenCalled();
      expect(result.nombre).toBe('Nueva');
    });
  });

 
  describe('remove', () => {
    it('debe eliminar sucursal', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(baseSucursal as Sucursales);

      repo.remove.mockResolvedValue(baseSucursal as Sucursales);

      await service.remove('suc-1');

      expect(repo.remove).toHaveBeenCalledWith(baseSucursal);
    });
  });
});
