import { Test, TestingModule } from '@nestjs/testing';
import { HistorialController } from './historial.controller';
import { HistorialService } from './historial.service';

describe('HistorialController', () => {
  let controller: HistorialController;
  let service: HistorialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialController],
      providers: [
        {
          provide: HistorialService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HistorialController>(HistorialController);
    service = module.get<HistorialService>(HistorialService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create', async () => {
    const dto = {
      id_reserva: '1',
      id_usuario: '2',
      accion: 'CREAR',
      fecha: new Date(),
    };

    const mockResult = { id: '123', ...dto };

    jest.spyOn(service, 'create').mockResolvedValue(mockResult as any);

    const result = await controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBeDefined();
  });
});
