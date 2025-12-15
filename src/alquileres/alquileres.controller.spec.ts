import { Test, TestingModule } from '@nestjs/testing';
import { AlquileresController } from './alquileres.controller';

describe('AlquileresController', () => {
  let controller: AlquileresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlquileresController],
    }).compile();

    controller = module.get<AlquileresController>(AlquileresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
