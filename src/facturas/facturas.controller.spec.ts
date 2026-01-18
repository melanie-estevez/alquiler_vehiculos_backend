import { Test, TestingModule } from '@nestjs/testing';
import { FacturasController } from './facturas.controller';
import { FacturasService } from './facturas.service';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

describe('FacturasController', () => {
  let controller: FacturasController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturasController],
      providers: [{ provide: FacturasService, useValue: serviceMock }],
    }).compile();

    controller = module.get<FacturasController>(FacturasController);
  });

  describe('create', () => {
    it('devuelve SuccessResponseDto con el mensaje correcto y la factura creada', async () => {
      const dto: any = { id_cliente: 'C-1', subtotal: 100, iva: 12, total: 112 };
      const facturaCreada: any = { id_factura: 'F-1', ...dto };

      serviceMock.create.mockResolvedValue(facturaCreada);

      const respuesta: any = await controller.create(dto);

      expect(respuesta).toBeInstanceOf(SuccessResponseDto);
      expect(respuesta.message).toBe('Factura creada correctamente');
      expect(respuesta.data).toEqual(facturaCreada);
    });
  });

  describe('findAll', () => {
    it('aplica el límite máximo de 100 y devuelve SuccessResponseDto con el listado', async () => {
      const queryDto: any = { page: 1, limit: 500, search: 'F-' };

      const result: any = {
        items: [{ id_factura: 'F-1' }],
        meta: { totalItems: 1, currentPage: 1, itemsPerPage: 100 },
        links: {},
      };

      serviceMock.findAll.mockResolvedValue(result);

      const respuesta: any = await controller.findAll(queryDto);

      expect(queryDto.limit).toBe(100);

      expect(respuesta).toBeInstanceOf(SuccessResponseDto);
      expect(respuesta.message).toBe('Listado de facturas');
      expect(respuesta.data).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('devuelve SuccessResponseDto con la factura solicitada', async () => {
      const factura: any = { id_factura: 'F-1', total: 112 };
      serviceMock.findOne.mockResolvedValue(factura);

      const respuesta: any = await controller.findOne('F-1');

      expect(respuesta).toBeInstanceOf(SuccessResponseDto);
      expect(respuesta.message).toBe('Factura encontrada');
      expect(respuesta.data).toEqual(factura);
    });
  });
  
    describe('update', () => {
    it('actualiza una factura existente y devuelve la respuesta estándar con los datos actualizados', async () => {
      const dto: any = {
        subtotal: 150,
        iva: 18,
        total: 168,
      };

      const facturaActualizada: any = {
        id_factura: 'F-1',
        ...dto,
      };

      serviceMock.update.mockResolvedValue(facturaActualizada);

      const respuesta: any = await controller.update('F-1', dto);

      expect(respuesta).toBeInstanceOf(SuccessResponseDto);
      expect(respuesta.message).toBe('Factura actualizada correctamente');
      expect(respuesta.data).toEqual(facturaActualizada);
    });
  });

  describe('remove', () => {
    it('devuelve SuccessResponseDto confirmando la eliminación', async () => {
      const result: any = { message: 'Factura eliminada' };
      serviceMock.remove.mockResolvedValue(result);

      const respuesta: any = await controller.remove('F-1');

      expect(respuesta).toBeInstanceOf(SuccessResponseDto);
      expect(respuesta.message).toBe('Factura eliminada correctamente');
      expect(respuesta.data).toEqual(result);
    });
  });
});
