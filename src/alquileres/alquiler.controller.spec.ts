import { Test, TestingModule } from '@nestjs/testing';
import { AlquilerController } from './alquiler.controller';
import { AlquilerService } from './alquiler.service';

describe('AlquilerController', () => {
  let controller: AlquilerController;
  let service: AlquilerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlquilerController],
      providers: [
        {
          provide: AlquilerService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AlquilerController>(AlquilerController);
    service = module.get<AlquilerService>(AlquilerService);
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