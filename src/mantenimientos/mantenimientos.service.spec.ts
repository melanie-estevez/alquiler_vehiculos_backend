import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { MantenimientoService } from './mantenimientos.service';
import { Mantenimiento } from './mantenimientos.entity';
import { Vehiculo } from '../vehiculos/vehiculos.entity';

describe('MantenimientoService', () => {
  let service: MantenimientoService;
  let mantenimientoRepo: Repository<Mantenimiento>;
  let vehiculoRepo: Repository<Vehiculo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MantenimientoService,
        {
          provide: getRepositoryToken(Mantenimiento),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Vehiculo),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MantenimientoService>(MantenimientoService);
    mantenimientoRepo = module.get<Repository<Mantenimiento>>(
      getRepositoryToken(Mantenimiento),
    );
    vehiculoRepo = module.get<Repository<Vehiculo>>(
      getRepositoryToken(Vehiculo),
    );
  });

  
  it('debe crear un mantenimiento correctamente', async () => {
    const vehiculoMock = { id_vehiculo: 'veh-1' } as Vehiculo;
    const mantenimientoMock = {
      id_mantenimiento: 'man-1',
      vehiculo: vehiculoMock,
    } as Mantenimiento;

    jest.spyOn(vehiculoRepo, 'findOne').mockResolvedValue(vehiculoMock);
    jest.spyOn(mantenimientoRepo, 'create').mockReturnValue(mantenimientoMock);
    jest
      .spyOn(mantenimientoRepo, 'save')
      .mockResolvedValue(mantenimientoMock);

    const result = await service.create({
      id_vehiculo: 'veh-1',
      observaciones: 'Cambio de aceite',
    } as any);

    expect(result).toEqual(mantenimientoMock);
  });

  it('debe lanzar error si el vehículo no existe', async () => {
    jest.spyOn(vehiculoRepo, 'findOne').mockResolvedValue(null);

    await expect(
      service.create({
        id_vehiculo: 'veh-x',
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  
  it('debe retornar un mantenimiento por id', async () => {
    const mantenimientoMock = {
      id_mantenimiento: 'man-1',
    } as Mantenimiento;

    jest
      .spyOn(mantenimientoRepo, 'findOne')
      .mockResolvedValue(mantenimientoMock);

    const result = await service.findOne('man-1');

    expect(result).toEqual(mantenimientoMock);
  });

  it('debe lanzar error si el mantenimiento no existe', async () => {
    jest.spyOn(mantenimientoRepo, 'findOne').mockResolvedValue(null);

    await expect(service.findOne('man-x')).rejects.toThrow(
      NotFoundException,
    );
  });


  it('debe actualizar un mantenimiento', async () => {
    const vehiculoMock = { id_vehiculo: 'veh-1' } as Vehiculo;
    const mantenimientoMock = {
      id_mantenimiento: 'man-1',
      vehiculo: vehiculoMock,
    } as Mantenimiento;

    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(mantenimientoMock);

    jest.spyOn(vehiculoRepo, 'findOne').mockResolvedValue(vehiculoMock);
    jest
      .spyOn(mantenimientoRepo, 'save')
      .mockResolvedValue(mantenimientoMock);

    const result = await service.update('man-1', {
      observaciones: 'Actualizado',
    } as any);

    expect(result).toEqual(mantenimientoMock);
  });

 
  it('debe eliminar un mantenimiento', async () => {
    const mantenimientoMock = {
      id_mantenimiento: 'man-1',
    } as Mantenimiento;

    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(mantenimientoMock);

    
    jest
      .spyOn(mantenimientoRepo, 'remove')
      .mockResolvedValue(mantenimientoMock as any);

    await service.remove('man-1');

    expect(mantenimientoRepo.remove).toHaveBeenCalledWith(
      mantenimientoMock,
    );
  });
});