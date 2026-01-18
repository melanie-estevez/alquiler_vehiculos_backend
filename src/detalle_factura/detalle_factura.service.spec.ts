import { Test, TestingModule } from '@nestjs/testing';
import { DetallesFacturaService } from './detalle_factura.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleFactura } from './detalle_factura.entity';
import { Factura } from 'src/facturas/factura.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));
import { paginate } from 'nestjs-typeorm-paginate';

describe('DetallesFacturaService', () => {
  let service: DetallesFacturaService;
  let detalleRepo: jest.Mocked<Repository<DetalleFactura>>;
  let facturaRepo: jest.Mocked<Repository<Factura>>;

  const detalleRepoMock = {
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const facturaRepoMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetallesFacturaService,
        { provide: getRepositoryToken(DetalleFactura), useValue: detalleRepoMock },
        { provide: getRepositoryToken(Factura), useValue: facturaRepoMock },
      ],
    }).compile();

    service = module.get<DetallesFacturaService>(DetallesFacturaService);
    detalleRepo = module.get(getRepositoryToken(DetalleFactura));
    facturaRepo = module.get(getRepositoryToken(Factura));
  });

  describe('findAll', () => {
    it('debería crear una consulta y paginar', async () => {
      const qb: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      };
      detalleRepo.createQueryBuilder.mockReturnValue(qb);

      const queryDto: any = { page: 1, limit: 10, search: 'abc' };
      const paginationResult: any = { items: [{ id_detalle: 'D-1' }], meta: {}, links: {} };
      (paginate as jest.Mock).mockResolvedValue(paginationResult);

      const result = await service.findAll(queryDto);

      expect(detalleRepo.createQueryBuilder).toHaveBeenCalledWith('detalle');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('detalle.factura', 'factura');
      expect(qb.andWhere).toHaveBeenCalledTimes(1);
      expect(qb.andWhere.mock.calls[0][1]).toEqual({ search: '%abc%' });

      expect(paginate).toHaveBeenCalledWith(qb, { page: 1, limit: 10 });
      expect(result).toBe(paginationResult);
    });

    it('debería lanzar InternalServerErrorException en caso de error inesperado', async () => {
      detalleRepo.createQueryBuilder.mockImplementation(() => {
        throw new Error('boom');
      });

      await expect(service.findAll({ page: 1, limit: 10 } as any)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('create', () => {
    it('debería lanzar una excepción NotFoundException si no se encuentra la factura', async () => {
      facturaRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          id_factura: 'F-1',
          descripcion: 'Item',
          cantidad: 2,
          precio_unitario: 5,
        } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('debe calcular el total y guardar el detalle', async () => {
      const factura: any = { id_factura: 'F-1' };
      facturaRepo.findOne.mockResolvedValue(factura);

      const dto: any = {
        id_factura: 'F-1',
        descripcion: 'Item',
        cantidad: 3,
        precio_unitario: 10,
      };

      const createdEntity: any = {
        descripcion: 'Item',
        cantidad: 3,
        precio_unitario: 10,
        total: 30,
        factura,
      };

      detalleRepo.create.mockReturnValue(createdEntity);
      detalleRepo.save.mockResolvedValue({ id_detalle: 'D-1', ...createdEntity });

      const result: any = await service.create(dto);

      expect(detalleRepo.create).toHaveBeenCalledWith({
        descripcion: 'Item',
        cantidad: 3,
        precio_unitario: 10,
        total: 30,
        factura,
      });
      expect(detalleRepo.save).toHaveBeenCalledWith(createdEntity);
      expect(result.total).toBe(30);
    });
  });

  describe('findOne', () => {
    it('debería lanzar NotFoundException si no se encuentra el detalle', async () => {
      detalleRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('D-404')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería lanzar una excepción NotFoundException si no se encuentra el detalle', async () => {
      detalleRepo.findOne.mockResolvedValue(null);

      await expect(service.update('D-404', { descripcion: 'x' } as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debería lanzar una excepción NotFoundException si no se encuentra el detalle', async () => {
      detalleRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('D-404')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
