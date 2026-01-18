jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

import { VehiculoService } from './vehiculos.service';
import { Vehiculo } from './vehiculos.entity';
import { Sucursales } from '../sucursales/sucursales.entity';
import { QueryDto } from 'src/common/dto/query.dto';

describe('VehiculoService', () => {
  let service: VehiculoService;

  let vehiculoRepo: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    remove: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  let sucursalRepo: {
    findOne: jest.Mock;
  };

  let qb: {
    leftJoinAndSelect: jest.Mock;
    andWhere: jest.Mock;
    orderBy: jest.Mock;
  };

  const baseSucursal: Sucursales = {
    id_sucursal: 'suc-1',
    nombre: 'Sucursal Centro',
  } as any;

  const baseVehiculo: Vehiculo = {
    id_vehiculo: 'veh-1',
    marca: 'Toyota',
    modelo: 'Corolla',
    placa: 'ABC-123',
    anio: 2022,
    estado: 'disponible',
    sucursal: baseSucursal,
  } as any;

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
    };

    vehiculoRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    };

    sucursalRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiculoService,
        {
          provide: getRepositoryToken(Vehiculo),
          useValue: vehiculoRepo,
        },
        {
          provide: getRepositoryToken(Sucursales),
          useValue: sucursalRepo,
        },
      ],
    }).compile();

    service = module.get<VehiculoService>(VehiculoService);

    jest.clearAllMocks();
    (paginate as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  
  describe('create', () => {
    it('debe crear vehículo con sucursal', async () => {
      sucursalRepo.findOne.mockResolvedValue(baseSucursal);
      vehiculoRepo.create.mockReturnValue(baseVehiculo);
      vehiculoRepo.save.mockResolvedValue(baseVehiculo);

      const dto = {
        marca: 'Toyota',
        modelo: 'Corolla',
        placa: 'ABC-123',
        anio: 2022,
        estado: 'disponible',
        id_sucursal: 'suc-1',
      };

      const result = await service.create(dto as any);

      expect(sucursalRepo.findOne).toHaveBeenCalledWith({
        where: { id_sucursal: 'suc-1' },
      });

      
      expect(vehiculoRepo.create).toHaveBeenCalledWith({
        marca: 'Toyota',
        modelo: 'Corolla',
        placa: 'ABC-123',
        anio: 2022,
        estado: 'disponible',
        sucursal: baseSucursal,
      });

      expect(vehiculoRepo.save).toHaveBeenCalledWith(baseVehiculo);
      expect(result).toEqual(baseVehiculo);
    });

    it('debe retornar null si la sucursal no existe', async () => {
      sucursalRepo.findOne.mockResolvedValue(null);

      const result = await service.create({
        id_sucursal: 'no-existe',
      } as any);

      expect(result).toBeNull();
    });

    it('debe retornar null si ocurre error', async () => {
      vehiculoRepo.create.mockImplementationOnce(() => {
        throw new Error('create error');
      });

      const result = await service.create({} as any);

      expect(result).toBeNull();
    });
  });

  
  describe('findAll', () => {
    it('debe filtrar por estado y ordenar', async () => {
      const query: QueryDto = {
        page: 1,
        limit: 10,
        search: 'disponible',
        searchField: 'estado',
        sort: 'marca',
        order: 'ASC',
      };

      const paginated: Pagination<Vehiculo> = {
        items: [baseVehiculo],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        } as any,
        links: {} as any,
      };

      (paginate as jest.Mock).mockResolvedValue(paginated);

      const result = await service.findAll(query);

      expect(vehiculoRepo.createQueryBuilder).toHaveBeenCalledWith('vehiculo');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        'vehiculo.sucursal',
        'sucursal',
      );
      expect(qb.andWhere).toHaveBeenCalledWith(
        'vehiculo.estado = :estado',
        { estado: 'disponible' },
      );
      expect(qb.orderBy).toHaveBeenCalledWith('vehiculo.marca', 'ASC');
      expect(result).toEqual(paginated);
    });

    it('debe buscar por defecto (marca, modelo o placa)', async () => {
      const query: QueryDto = {
        page: 1,
        limit: 10,
        search: 'toyota',
      };

      (paginate as jest.Mock).mockResolvedValue({
        items: [baseVehiculo],
        meta: {} as any,
      });

      await service.findAll(query);

      expect(qb.andWhere).toHaveBeenCalledWith(
        `(vehiculo.marca ILIKE :search 
            OR vehiculo.modelo ILIKE :search 
            OR vehiculo.placa ILIKE :search)`,
        { search: '%toyota%' },
      );
    });

    it('debe retornar null si ocurre error', async () => {
      vehiculoRepo.createQueryBuilder.mockImplementationOnce(() => {
        throw new Error('qb error');
      });

      const result = await service.findAll({ page: 1, limit: 10 } as any);

      expect(result).toBeNull();
    });
  });

  
  describe('findOne', () => {
    it('debe retornar un vehículo con relaciones', async () => {
      vehiculoRepo.findOne.mockResolvedValue(baseVehiculo);

      const result = await service.findOne('veh-1');

      expect(vehiculoRepo.findOne).toHaveBeenCalledWith({
        where: { id_vehiculo: 'veh-1' },
        relations: ['sucursal', 'reservas', 'mantenimientos'],
      });

      expect(result).toEqual(baseVehiculo);
    });

    it('debe retornar null si ocurre error', async () => {
      vehiculoRepo.findOne.mockRejectedValue(new Error('error'));

      const result = await service.findOne('veh-1');

      expect(result).toBeNull();
    });
  });

  
  describe('update', () => {
    it('debe actualizar vehículo', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(baseVehiculo);
      sucursalRepo.findOne.mockResolvedValue(baseSucursal);
      vehiculoRepo.save.mockResolvedValue(baseVehiculo);

      const result = await service.update('veh-1', {
        marca: 'Mazda',
        id_sucursal: 'suc-1',
      } as any);

      expect(result).toEqual(baseVehiculo);
    });

    it('debe retornar null si no existe vehículo', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await service.update('veh-x', {} as any);

      expect(result).toBeNull();
    });
  });


  describe('remove', () => {
    it('debe eliminar vehículo', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(baseVehiculo);
      vehiculoRepo.remove.mockResolvedValue(baseVehiculo);

      const result = await service.remove('veh-1');

      expect(vehiculoRepo.remove).toHaveBeenCalledWith(baseVehiculo);
      expect(result).toEqual(baseVehiculo);
    });

    it('debe retornar null si no existe', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await service.remove('veh-x');

      expect(result).toBeNull();
    });
  });
});
