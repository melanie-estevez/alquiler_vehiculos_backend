import { Test, TestingModule } from '@nestjs/testing';
import { PagosService } from './pagos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pago } from './pagos.entity';
import { Repository } from 'typeorm';

describe('PagosService', () => {
  let service: PagosService;
  let repository: Repository<Pago>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagosService,
        {
          provide: getRepositoryToken(Pago),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PagosService>(PagosService);
    repository = module.get<Repository<Pago>>(
      getRepositoryToken(Pago),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return pagos', async () => {
    const pagoFake = [{ id: 1 }];

    jest.spyOn(repository, 'find').mockResolvedValue(pagoFake as any);

    const result = await service.findAll();

    expect(result).toEqual(pagoFake);
  });
});
