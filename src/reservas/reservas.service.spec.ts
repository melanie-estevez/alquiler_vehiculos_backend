/*jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { NotFoundException } from '@nestjs/common';

import { ReservaService } from './reservas.service';
import { Reservas } from './reservas.entity';
import { Vehiculo } from '../vehiculos/vehiculos.entity';
import { QueryDto } from 'src/common/dto/query.dto';

describe('ReservaService', () => {
  let service: ReservaService;

  let reservaRepo: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    remove: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  let vehiculoRepo: {
    findOne: jest.Mock;
  };

  let qb: {
    leftJoinAndSelect: jest.Mock;
    andWhere: jest.Mock;
  };

  const baseVehiculo: Partial<Vehiculo> = {
    id_vehiculo: 'veh-1',
    placa: 'ABC-123',
    marca: 'Toyota',
    modelo: 'Corolla',
  };

  const baseReserva: Partial<Reservas> = {
    id_reserva: 'res-1',
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    vehiculo: baseVehiculo as Vehiculo,
  };

  beforeEach(async () => {
    qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
    };

    reservaRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    };

    vehiculoRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservaService,
        {
          provide: getRepositoryToken(Reservas),
          useValue: reservaRepo,
        },
        {
          provide: getRepositoryToken(Vehiculo),
          useValue: vehiculoRepo,
        },
      ],
    }).compile();

    service = module.get<ReservaService>(ReservaService);

    jest.clearAllMocks();
    (paginate as jest.Mock).mockReset();
  });

  describe('create', () => {
    it('debe crear una reserva con vehículo', async () => {
      vehiculoRepo.findOne.mockResolvedValue(baseVehiculo);
      reservaRepo.create.mockReturnValue(baseReserva);
      reservaRepo.save.mockResolvedValue(baseReserva);

      const dto = {
        id_vehiculo: 'veh-1',
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
      };

      const result = await service.create(dto as any);

      expect(vehiculoRepo.findOne).toHaveBeenCalledWith({
        where: { id_vehiculo: 'veh-1' },
      });

      expect(reservaRepo.create).toHaveBeenCalledWith({
        fecha_inicio: dto.fecha_inicio,
        fecha_fin: dto.fecha_fin,
        vehiculo: baseVehiculo,
      });

      expect(reservaRepo.save).toHaveBeenCalled();
      expect(result).toEqual(baseReserva);
    });

    it('debe lanzar error si el vehículo no existe', async () => {
      vehiculoRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({ id_vehiculo: 'no-existe' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debe filtrar por placa del vehículo', async () => {
      const query: QueryDto = {
        page: 1,
        limit: 10,
        search: 'ABC',
      };

      const paginated: Pagination<Reservas> = {
        items: [baseReserva as Reservas],
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

      expect(reservaRepo.createQueryBuilder).toHaveBeenCalledWith(
        'reserva',
      );

      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        'reserva.vehiculo',
        'vehiculo',
      );

      expect(qb.andWhere).toHaveBeenCalledWith(
        `
          vehiculo.placa ILIKE :search
        `,
        { search: '%ABC%' },
      );

      expect(paginate).toHaveBeenCalled();
      expect(result).toEqual(paginated);
    });
  });

  describe('findOne', () => {
    it('debe retornar una reserva con vehículo', async () => {
      reservaRepo.findOne.mockResolvedValue(baseReserva);

      const result = await service.findOne('res-1');

      expect(reservaRepo.findOne).toHaveBeenCalledWith({
        where: { id_reserva: 'res-1' },
        relations: ['vehiculo'],
      });

      expect(result).toEqual(baseReserva);
    });

    it('debe lanzar error si no existe', async () => {
      reservaRepo.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('no-existe'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar reserva y vehículo', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(baseReserva as Reservas);

      vehiculoRepo.findOne.mockResolvedValue(baseVehiculo);
      reservaRepo.save.mockResolvedValue(baseReserva);

      const result = await service.update('res-1', {
        id_vehiculo: 'veh-1',
      } as any);

      expect(vehiculoRepo.findOne).toHaveBeenCalled();
      expect(reservaRepo.save).toHaveBeenCalled();
      expect(result).toEqual(baseReserva);
    });

    it('debe lanzar error si el nuevo vehículo no existe', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(baseReserva as Reservas);

      vehiculoRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('res-1', {
          id_vehiculo: 'veh-x',
        } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar reserva', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(baseReserva as Reservas);

      reservaRepo.remove.mockResolvedValue(baseReserva);

      await service.remove('res-1');

      expect(reservaRepo.remove).toHaveBeenCalledWith(baseReserva);
    });
  });
});*/