import { Test, TestingModule } from '@nestjs/testing';
import { Historial_usuarioService } from './historial_usuario.service';
import { Historial_usuarioController } from './historial_usuario.controller';

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