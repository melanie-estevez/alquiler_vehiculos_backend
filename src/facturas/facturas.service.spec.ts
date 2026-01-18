import { Test, TestingModule } from '@nestjs/testing';
import { FacturasService } from './facturas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Factura } from './factura.entity';
import { DetalleFactura } from '../detalle_factura/detalle_factura.entity';
import { Reservas } from '../reservas/reservas.entity';
import { Cliente } from '../clientes/cliente.entity';
import { EstadoFactura } from './enums/estado-factura.enum';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));
import { paginate } from 'nestjs-typeorm-paginate';

describe('FacturasService', () => {
  let service: FacturasService;
  const facturaRepoMock = {
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const detalleRepoMock = {
    create: jest.fn(),
  };

  const reservaRepoMock = {
    findOne: jest.fn(),
  };

  const clienteRepoMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacturasService,
        { provide: getRepositoryToken(Factura), useValue: facturaRepoMock },
        { provide: getRepositoryToken(DetalleFactura), useValue: detalleRepoMock },
        { provide: getRepositoryToken(Reservas), useValue: reservaRepoMock },
        { provide: getRepositoryToken(Cliente), useValue: clienteRepoMock },
      ],
    }).compile();

    service = module.get<FacturasService>(FacturasService);
  });

  describe('findAll', () => {
    it('construye el query con joins, aplica búsqueda y pagina el resultado', async () => {
      const qb: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      };
      facturaRepoMock.createQueryBuilder.mockReturnValue(qb);

      const queryDto: any = { page: 1, limit: 10, search: 'juan' };
      const paginado: any = { items: [{ id_factura: 'F-1' }], meta: {}, links: {} };
      (paginate as jest.Mock).mockResolvedValue(paginado);

      const result = await service.findAll(queryDto);

      expect(facturaRepoMock.createQueryBuilder).toHaveBeenCalledWith('factura');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('factura.cliente', 'cliente');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('factura.reserva', 'reserva');

      expect(qb.andWhere).toHaveBeenCalledTimes(1);
      expect(qb.andWhere.mock.calls[0][1]).toEqual({ search: '%juan%' });

      expect(paginate).toHaveBeenCalledWith(qb, { page: 1, limit: 10 });
      expect(result).toBe(paginado);
    });

    it('si ocurre un error inesperado, devuelve InternalServerErrorException', async () => {
      facturaRepoMock.createQueryBuilder.mockImplementation(() => {
        throw new Error('boom');
      });

      await expect(service.findAll({ page: 1, limit: 10 } as any)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('create', () => {
    it('rechaza la creación si no hay detalles', async () => {
      reservaRepoMock.findOne.mockResolvedValue({ id_reserva: 'R-1' } as any);
      clienteRepoMock.findOne.mockResolvedValue({ id: 'C-1' } as any);

      await expect(
        service.create({ id_reserva: 'R-1', id_cliente: 'C-1', detalles: [] } as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('calcula subtotal/iva/total y guarda la factura con estado por defecto', async () => {
      const reserva: any = { id_reserva: 'R-1' };
      const cliente: any = { id: 'C-1' };

      reservaRepoMock.findOne.mockResolvedValue(reserva);
      clienteRepoMock.findOne.mockResolvedValue(cliente);

      const dto: any = {
        id_reserva: 'R-1',
        id_cliente: 'C-1',
        detalles: [
          { descripcion: 'A', cantidad: 2, precio_unitario: 10 },
          { descripcion: 'B', cantidad: 1, precio_unitario: 5 },
        ],
      };
      detalleRepoMock.create.mockImplementation((d: any) => d);
      facturaRepoMock.create.mockImplementation((f: any) => f);

      const facturaGuardada: any = { id_factura: 'F-1' };
      facturaRepoMock.save.mockResolvedValue(facturaGuardada);
      const result = await service.create(dto);

      expect(detalleRepoMock.create).toHaveBeenCalledWith({ ...dto.detalles[0], total: 20 });
      expect(detalleRepoMock.create).toHaveBeenCalledWith({ ...dto.detalles[1], total: 5 });

      const argsFactura = facturaRepoMock.create.mock.calls[0][0];
      expect(argsFactura.subtotal).toBe(25);
      expect(argsFactura.iva).toBe(25 * 0.15);
      expect(argsFactura.total).toBe(25 + 25 * 0.15);
      expect(argsFactura.estado).toBe(EstadoFactura.PENDIENTE);

      expect(result).toBe(facturaGuardada);
    });
  });

  describe('update', () => {
    it('si la factura no existe, lanza NotFoundException y no guarda', async () => {
      facturaRepoMock.findOne.mockResolvedValue(null);

      await expect(
        service.update('F-404', { estado: EstadoFactura.PAGADO } as any),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(facturaRepoMock.findOne).toHaveBeenCalledWith({
        where: { id_factura: 'F-404' },
      });

      expect(facturaRepoMock.save).not.toHaveBeenCalled();
    });

    it('si llega dto.estado, actualiza el estado y guarda la factura', async () => {
      const facturaExistente: any = { id_factura: 'F-1', estado: EstadoFactura.PENDIENTE };
      facturaRepoMock.findOne.mockResolvedValue(facturaExistente);
      facturaRepoMock.save.mockImplementation(async (f: any) => f);

      const result: any = await service.update('F-1', { estado: EstadoFactura.PAGADO } as any);

      expect(facturaExistente.estado).toBe(EstadoFactura.PAGADO);
      expect(facturaRepoMock.save).toHaveBeenCalledWith(facturaExistente);
      expect(result.estado).toBe(EstadoFactura.PAGADO);
    });
  });

  describe('remove', () => {
    it('si la factura no existe, lanza NotFoundException', async () => {
      facturaRepoMock.findOne.mockResolvedValue(null);

      await expect(service.remove('F-404')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
