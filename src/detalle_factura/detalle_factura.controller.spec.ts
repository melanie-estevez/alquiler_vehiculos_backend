import { Test, TestingModule } from '@nestjs/testing';
import { DetallesFacturaController } from './detalle_factura.controller';

describe('DetalleFacturaController', () => {
  let controller: DetallesFacturaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetallesFacturaController],
    }).compile();

    controller = module.get<DetallesFacturaController>(DetallesFacturaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});