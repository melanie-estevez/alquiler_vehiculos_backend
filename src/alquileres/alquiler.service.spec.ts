import { Test, TestingModule } from '@nestjs/testing';
import { AlquilerService } from './alquiler.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Alquiler } from './alquiler.entity';
import { Repository } from 'typeorm';

describe('AlquilerService', () => {
  let service: AlquilerService;
  let repository: Repository<Alquiler>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlquilerService,
        {
          provide: getRepositoryToken(Alquiler),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AlquilerService>(AlquilerService);
    repository = module.get<Repository<Alquiler>>(
      getRepositoryToken(Alquiler),
    );
  });

  it('Debe ser definido', () => {
    expect(service).toBeDefined();
  });

  it('Deberia de devolver alquileres', async () => {
    const alquileresFake = [{ id: 1 }];

    jest.spyOn(repository, 'find').mockResolvedValue(alquileresFake as any);

    const result = await service.findAll();

    expect(result).toEqual(alquileresFake);
  });
});