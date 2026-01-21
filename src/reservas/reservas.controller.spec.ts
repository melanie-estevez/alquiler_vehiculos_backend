import { Test, TestingModule } from '@nestjs/testing';
import { ReservaController } from './reservas.controller';
import { ReservaService } from './reservas.service';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';

describe('ReservaController', () => {
  let controller: ReservaController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  const baseReserva = {
    id_reserva: 'res-1',
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    vehiculo: {
      id_vehiculo: 'veh-1',
      placa: 'ABC-123',
    },
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservaController],
      providers: [
        {
          provide: ReservaService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<ReservaController>(ReservaController);
  });

  describe('create', () => {
    it('debe crear una reserva', async () => {
      service.create.mockResolvedValue(baseReserva);

      const dto = {
        id_vehiculo: 'veh-1',
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
      };

      const result = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);

      expect(result).toEqual(
        new SuccessResponseDto(
          'Reserva creada correctamente',
          baseReserva,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('debe retornar reservas paginadas', async () => {
      const query: QueryDto = {
        page: 1,
        limit: 10,
      };

      const paginatedResult = {
        items: [baseReserva],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
        links: {},
      };

      service.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);

      expect(result).toEqual(
        new SuccessResponseDto('Reservas obtenidas', {
          items: paginatedResult.items,
          meta: paginatedResult.meta,
          links: paginatedResult.links,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('debe retornar una reserva por id', async () => {
      service.findOne.mockResolvedValue(baseReserva);

      const result = await controller.findOne('res-1');

      expect(service.findOne).toHaveBeenCalledWith('res-1');

      expect(result).toEqual(
        new SuccessResponseDto(
          'Reserva encontrada',
          baseReserva,
        ),
      );
    });
  });

  describe('update', () => {
    it('debe actualizar una reserva', async () => {
      service.update.mockResolvedValue(baseReserva);

      const dto = {
        fecha_fin: new Date(),
      };

      const result = await controller.update('res-1', dto as any);

      expect(service.update).toHaveBeenCalledWith('res-1', dto);

      expect(result).toEqual(
        new SuccessResponseDto(
          'Reserva actualizada correctamente',
          baseReserva,
        ),
      );
    });
  });


  describe('remove', () => {
    it('debe eliminar una reserva', async () => {
      service.remove.mockResolvedValue(undefined);

      const result = await controller.remove('res-1');

      expect(service.remove).toHaveBeenCalledWith('res-1');

      expect(result).toEqual(
        new SuccessResponseDto(
          'Reserva eliminada correctamente',
          null,
        ),
      );
    });
  });
});