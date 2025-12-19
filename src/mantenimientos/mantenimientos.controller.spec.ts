import { Test, TestingModule } from '@nestjs/testing';
import { MantenimientoController } from './mantenimientos.controller';

describe('MantenimientosController', () => {
  let controller: MantenimientoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MantenimientoController],
    }).compile();

    controller = module.get<MantenimientoController>(MantenimientoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
