import { Test, TestingModule } from '@nestjs/testing';
import { VehiculoController } from './vehiculos.controller';
import { VehiculoService } from './vehiculos.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

describe('VehiculoController', () => {
  let controller: VehiculoController;
  let service: VehiculoService;

  const mockVehiculo = {
    id_vehiculo: 'veh-1',
    marca: 'Toyota',
    modelo: 'Corolla',
    placa: 'ABC-123',
    estado: 'disponible',
  };

  const mockVehiculoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiculoController],
      providers: [
        {
          provide: VehiculoService,
          useValue: mockVehiculoService,
        },
      ],
    }).compile();

    controller = module.get<VehiculoController>(VehiculoController);
    service = module.get<VehiculoService>(VehiculoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('create', () => {
    it('debe crear un vehículo', async () => {
      mockVehiculoService.create.mockResolvedValue(mockVehiculo);

      const result = await controller.create(mockVehiculo as any);

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockVehiculo);
      expect(service.create).toHaveBeenCalled();
    });

    it('debe lanzar error si no se crea', async () => {
      mockVehiculoService.create.mockResolvedValue(null);

      await expect(controller.create(mockVehiculo as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });


  describe('findAll', () => {
    it('debe retornar vehículos', async () => {
      const paginationResult = {
        items: [mockVehiculo],
        meta: {},
        links: {},
      };

      mockVehiculoService.findAll.mockResolvedValue(paginationResult);

      const result = await controller.findAll({} as any);

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(paginationResult);
    });

    it('debe lanzar error si ocurre fallo', async () => {
      mockVehiculoService.findAll.mockResolvedValue(null);

      await expect(controller.findAll({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('debe retornar un vehículo', async () => {
      mockVehiculoService.findOne.mockResolvedValue(mockVehiculo);

      const result = await controller.findOne('veh-1');

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockVehiculo);
    });

    it('debe lanzar NotFound si no existe', async () => {
      mockVehiculoService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('veh-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('debe actualizar un vehículo', async () => {
      mockVehiculoService.update.mockResolvedValue(mockVehiculo);

      const result = await controller.update('veh-1', {} as any);

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockVehiculo);
    });

    it('debe lanzar NotFound si no existe', async () => {
      mockVehiculoService.update.mockResolvedValue(null);

      await expect(
        controller.update('veh-1', {} as any),
      ).rejects.toThrow(NotFoundException);
    });
  });


  describe('remove', () => {
    it('debe eliminar un vehículo', async () => {
      mockVehiculoService.remove.mockResolvedValue(mockVehiculo);

      const result = await controller.remove('veh-1');

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data).toEqual(mockVehiculo);
    });

    it('debe lanzar NotFound si no existe', async () => {
      mockVehiculoService.remove.mockResolvedValue(null);

      await expect(controller.remove('veh-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});