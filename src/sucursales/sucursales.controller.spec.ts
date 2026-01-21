import { Test, TestingModule } from '@nestjs/testing';
import { SucursalesController } from './sucursales.controller';
import { SucursalesService } from './sucursales.service';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Sucursales } from './sucursales.entity';

describe('SucursalesController', () => {
  let controller: SucursalesController;
  let service: jest.Mocked<SucursalesService>;

  
  const baseSucursal: Partial<Sucursales> = {
    id_sucursal: 'suc-1',
    nombre: 'Sucursal Centro',
    ciudad: 'Quito',
    direccion: 'Av. Siempre Viva',
    vehiculos: [],
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SucursalesController],
      providers: [
        {
          provide: SucursalesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<SucursalesController>(SucursalesController);
  });

  
  describe('create', () => {
    it('debe crear una sucursal y retornar SuccessResponseDto', async () => {
      service.create.mockResolvedValue(baseSucursal as Sucursales);

      const result = await controller.create(baseSucursal as any);

      expect(service.create).toHaveBeenCalledWith(baseSucursal);
      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.message).toBe('Sucursal creada correctamente');
      expect(result.data).toEqual(baseSucursal);
    });
  });


  describe('findAll', () => {
    it('debe retornar sucursales paginadas', async () => {
      const query: QueryDto = {
        page: 1,
        limit: 10,
      };

      service.findAll.mockResolvedValue({
        items: [baseSucursal as Sucursales],
        meta: { totalItems: 1 } as any,
        links: {} as any,
      });

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result.message).toBe('Sucursales obtenidas');
      expect(result.data.items).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('debe retornar una sucursal', async () => {
      service.findOne.mockResolvedValue(baseSucursal as Sucursales);

      const result = await controller.findOne('suc-1');

      expect(service.findOne).toHaveBeenCalledWith('suc-1');
      expect(result.message).toBe('Sucursal encontrada');
      expect(result.data).toEqual(baseSucursal);
    });
  });

  
  describe('update', () => {
    it('debe actualizar sucursal', async () => {
      service.update.mockResolvedValue({
        ...baseSucursal,
        nombre: 'Nueva',
      } as Sucursales);

      const result = await controller.update('suc-1', {
        nombre: 'Nueva',
      } as any);

      expect(service.update).toHaveBeenCalledWith('suc-1', {
        nombre: 'Nueva',
      });
      expect(result.message).toBe(
        'Sucursal actualizada correctamente',
      );
      expect(result.data.nombre).toBe('Nueva');
    });
  });

  
  describe('remove', () => {
    it('debe eliminar sucursal', async () => {
      service.remove.mockResolvedValue(undefined);

      const result = await controller.remove('suc-1');

      expect(service.remove).toHaveBeenCalledWith('suc-1');
      expect(result.message).toBe('Sucursal eliminada');
      expect(result.data).toBeNull();
    });
  });
});
