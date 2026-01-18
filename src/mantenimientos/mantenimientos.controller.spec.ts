import { Test, TestingModule } from '@nestjs/testing';
import { MantenimientoController } from './mantenimientos.controller';
import { MantenimientoService } from './mantenimientos.service';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

describe('MantenimientoController', () => {
  let controller: MantenimientoController;
  let service: MantenimientoService;

  const mantenimientoMock = {
    id_mantenimiento: 'man-1',
    observaciones: 'Cambio de aceite',
  };

  const paginationMock = {
    items: [mantenimientoMock],
    meta: { totalItems: 1 },
    links: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MantenimientoController],
      providers: [
        {
          provide: MantenimientoService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MantenimientoController>(
      MantenimientoController,
    );
    service = module.get<MantenimientoService>(MantenimientoService);
  });

  it('debe crear un mantenimiento', async () => {
    jest
      .spyOn(service, 'create')
      .mockResolvedValue(mantenimientoMock as any);

    const result = await controller.create({} as any);

    expect(result).toBeInstanceOf(SuccessResponseDto);
    expect(result.data).toEqual(mantenimientoMock);
  });

  it('debe retornar mantenimientos paginados', async () => {
    jest
      .spyOn(service, 'findAll')
      .mockResolvedValue(paginationMock as any);

    const result = await controller.findAll({
      page: 1,
      limit: 10,
    } as any);

    expect(result).toBeInstanceOf(SuccessResponseDto);
    expect(result.data.items.length).toBe(1);
  });

  it('debe limitar el limit a 100', async () => {
    jest
      .spyOn(service, 'findAll')
      .mockResolvedValue(paginationMock as any);

    const query = { limit: 500 } as any;
    await controller.findAll(query);

    expect(query.limit).toBe(100);
  });

  it('debe retornar un mantenimiento por id', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(mantenimientoMock as any);

    const result = await controller.findOne('man-1');

    expect(result).toBeInstanceOf(SuccessResponseDto);
    expect(result.data).toEqual(mantenimientoMock);
  });

 
  it('debe actualizar un mantenimiento', async () => {
    jest
      .spyOn(service, 'update')
      .mockResolvedValue(mantenimientoMock as any);

    const result = await controller.update(
      'man-1',
      {} as any,
    );

    expect(result).toBeInstanceOf(SuccessResponseDto);
    expect(result.data).toEqual(mantenimientoMock);
  });

 
  it('debe eliminar un mantenimiento', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(undefined);

    const result = await controller.remove('man-1');

    expect(service.remove).toHaveBeenCalledWith('man-1');
    expect(result).toBeInstanceOf(SuccessResponseDto);
    expect(result.data).toBeNull();
  });
});
