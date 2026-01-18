import { Test, TestingModule } from '@nestjs/testing';
import { DetallesFacturaController } from './detalle_factura.controller';
import { DetallesFacturaService } from './detalle_factura.service';

describe('DetallesFacturaController', () => {
  let controller: DetallesFacturaController;

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
      controllers: [DetallesFacturaController],
      providers: [
        {
          provide: DetallesFacturaService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<DetallesFacturaController>(DetallesFacturaController);
  });

  describe('create', () => {
    it('crea un detalle de factura y devuelve un objeto con success, mensaje y datos', async () => {
      const dto: any = {
        id_factura: 'F-1',
        descripcion: 'Producto A',
        cantidad: 2,
        precio_unitario: 10,
      };

      const detalleCreado: any = {
        id_detalle: 'D-1',
        ...dto,
        total: 20,
      };

      serviceMock.create.mockResolvedValue(detalleCreado);

      const respuesta = await controller.create(dto);

      expect(respuesta).toEqual({
        success: true,
        message: 'Detalle de factura creado correctamente',
        data: detalleCreado,
      });
    });
  });

  describe('findAll', () => {
    it('limita el parámetro limit a 100 cuando se envia un valor mayor', async () => {
      const queryDto: any = {
        page: 1,
        limit: 500,
        search: 'producto',
      };

      const resultadoPaginado: any = {
        items: [{ id_detalle: 'D-1' }],
        meta: { totalItems: 1 },
        links: {},
      };

      serviceMock.findAll.mockResolvedValue(resultadoPaginado);

      const respuesta = await controller.findAll(queryDto);

      expect(queryDto.limit).toBe(100);

      expect(respuesta).toEqual({
        success: true,
        message: 'Listado de detalles de factura',
        data: resultadoPaginado,
      });
    });

    it('mantiene el valor de limit cuando es menor o igual a 100', async () => {
      const queryDto: any = {
        page: 1,
        limit: 20,
      };

      const resultadoPaginado: any = {
        items: [],
        meta: {},
        links: {},
      };

      serviceMock.findAll.mockResolvedValue(resultadoPaginado);

      const respuesta = await controller.findAll(queryDto);

      expect(queryDto.limit).toBe(20);

      expect(respuesta).toEqual({
        success: true,
        message: 'Listado de detalles de factura',
        data: resultadoPaginado,
      });
    });
  });

  describe('findOne', () => {
    it('devuelve un detalle de factura especifico junto con su mensaje de éxito', async () => {
      const detalle: any = {
        id_detalle: 'D-1',
        descripcion: 'Producto A',
        total: 20,
      };

      serviceMock.findOne.mockResolvedValue(detalle);

      const respuesta = await controller.findOne('D-1');

      expect(respuesta).toEqual({
        success: true,
        message: 'Detalle de factura encontrado',
        data: detalle,
      });
    });
  });

  describe('update', () => {
    it('actualiza los datos del detalle y devuelve el detalle actualizado', async () => {
      const dto: any = {
        descripcion: 'Producto actualizado',
      };

      const detalleActualizado: any = {
        id_detalle: 'D-1',
        descripcion: 'Producto actualizado',
      };

      serviceMock.update.mockResolvedValue(detalleActualizado);

      const respuesta = await controller.update('D-1', dto);

      expect(respuesta).toEqual({
        success: true,
        message: 'Detalle de factura actualizado',
        data: detalleActualizado,
      });
    });
  });

  describe('remove', () => {
    it('elimina el detalle de factura y devuelve un mensaje de confirmación', async () => {
      const resultadoEliminacion: any = {
        message: 'Detalle eliminado',
      };

      serviceMock.remove.mockResolvedValue(resultadoEliminacion);

      const respuesta = await controller.remove('D-1');

      expect(respuesta).toEqual({
        success: true,
        message: 'Detalle de factura eliminado',
        data: resultadoEliminacion,
      });
    });
  });
});
