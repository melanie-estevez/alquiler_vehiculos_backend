import { Test, TestingModule } from '@nestjs/testing';
import { AlquileresService } from './alquileres.service';

describe('AlquileresService', () => {
  let service: AlquileresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlquileresService],
    }).compile();

    service = module.get<AlquileresService>(AlquileresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
