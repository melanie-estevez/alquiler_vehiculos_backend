import { Test, TestingModule } from '@nestjs/testing';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';

describe('PagosController', () => {
  let controller: PagosController;
  let service: PagosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagosController],
      providers: [
        {
          provide: PagosService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PagosController>(PagosController);
    service = module.get<PagosService>(PagosService);
  });

  it('Debe ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('Debería de llamar a service.create', async () => {
    const dto = { /* datos fake */ };
    await controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
