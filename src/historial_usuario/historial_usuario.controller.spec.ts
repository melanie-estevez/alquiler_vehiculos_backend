import { Test, TestingModule } from '@nestjs/testing';
import { Historial_usuarioController } from './historial_usuario.controller';
import { Historial_usuarioService } from './historial_usuario.service';

describe('Historial_usuarioController', () => {
  let controller: Historial_usuarioController;
  let service: Historial_usuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Historial_usuarioController],
      providers: [
        {
          provide: Historial_usuarioService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<Historial_usuarioController>(Historial_usuarioController);
    service = module.get<Historial_usuarioService>(Historial_usuarioService);
  });

  it('Debe ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('Debería de llamar a service.create', async () => {
    const dto = {
      id_reserva: 'res-1',
      id_usuario: 'usr-1',
      accion: 'CREAR',
      fecha: new Date(),
    };

    const mockHistorial = {
      id: 'hist-1',
      ...dto,
    };

    jest
      .spyOn(service, 'create')
      .mockResolvedValue(mockHistorial as any);

    const result = await controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBeDefined();
  });
});