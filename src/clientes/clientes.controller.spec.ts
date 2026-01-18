import { Test, TestingModule } from '@nestjs/testing';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Role } from 'src/auth/enums/role.enum';

describe('ClientesController', () => {
  let controller: ClientesController;
  const clientesServiceMock = {
    findAll: jest.fn(),
    createForUser: jest.fn(),
    findByUserId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesController],
      providers: [{ provide: ClientesService, useValue: clientesServiceMock }],
    }).compile();

    controller = module.get<ClientesController>(ClientesController);
  });

  describe('findAll', () => {
    it('deberia limitar el límite a 100 y devolver SuccessResponseDto', async () => {
      const queryDto: any = { page: 1, limit: 999 };

      const serviceResult = {
        items: [{ id: '1', nombres: 'Juan' }],
        meta: { totalItems: 1 },
        links: {},
      };

      clientesServiceMock.findAll.mockResolvedValue(serviceResult);

      const res: any = await controller.findAll(queryDto);

      expect(queryDto.limit).toBe(100);
      expect(clientesServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(clientesServiceMock.findAll).toHaveBeenCalledWith(queryDto);

      expect(res).toBeInstanceOf(SuccessResponseDto);
      expect(res.message).toBe('Listado de clientes');
      expect(res.data).toEqual(serviceResult);
    });
  });

  describe('createMe', () => {
    it('debe crear un cliente para el usuario registrado', async () => {
      const req: any = { user: { sub: 'user-1', role: Role.USER } };
      const dto: any = { nombres: 'Juan', apellidos: 'Perez' };

      const created = { id: 'c-1', userId: 'user-1', ...dto };
      clientesServiceMock.createForUser.mockResolvedValue(created);

      const res: any = await controller.createMe(req, dto);

      expect(clientesServiceMock.createForUser).toHaveBeenCalledTimes(1);
      expect(clientesServiceMock.createForUser).toHaveBeenCalledWith('user-1', dto);

      expect(res).toBeInstanceOf(SuccessResponseDto);
      expect(res.message).toBe('Cliente creado correctamente');
      expect(res.data).toEqual(created);
    });
  });

  describe('me', () => {
    it('debe devolver el cliente del usuario conectado', async () => {
      const req: any = { user: { sub: 'user-1', role: Role.USER } };

      const cliente = { id: 'c-1', userId: 'user-1', nombres: 'Juan' };
      clientesServiceMock.findByUserId.mockResolvedValue(cliente);

      const res: any = await controller.me(req);

      expect(clientesServiceMock.findByUserId).toHaveBeenCalledTimes(1);
      expect(clientesServiceMock.findByUserId).toHaveBeenCalledWith('user-1');

      expect(res).toBeInstanceOf(SuccessResponseDto);
      expect(res.message).toBe('Cliente encontrado');
      expect(res.data).toEqual(cliente);
    });
  });

  describe('findOne', () => {
    it('debería devolver cliente por id', async () => {
      const cliente = { id: 'c-1', nombres: 'Juan' };
      clientesServiceMock.findOne.mockResolvedValue(cliente);

      const res: any = await controller.findOne('c-1');

      expect(clientesServiceMock.findOne).toHaveBeenCalledTimes(1);
      expect(clientesServiceMock.findOne).toHaveBeenCalledWith('c-1');

      expect(res).toBeInstanceOf(SuccessResponseDto);
      expect(res.message).toBe('Cliente encontrado');
      expect(res.data).toEqual(cliente);
    });
  });

  describe('update', () => {
    it('debe actualizar cliente y devolver SuccessResponseDto', async () => {
      const dto: any = { nombres: 'Juan Actualizado' };
      const updated = { id: 'c-1', ...dto };

      clientesServiceMock.update.mockResolvedValue(updated);

      const res: any = await controller.update('c-1', dto);

      expect(clientesServiceMock.update).toHaveBeenCalledTimes(1);
      expect(clientesServiceMock.update).toHaveBeenCalledWith('c-1', dto);

      expect(res).toBeInstanceOf(SuccessResponseDto);
      expect(res.message).toBe('Cliente actualizado correctamente');
      expect(res.data).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('debería eliminar cliente y devolver SuccessResponseDto', async () => {
      const serviceResult = { message: 'ok' };
      clientesServiceMock.remove.mockResolvedValue(serviceResult);

      const res: any = await controller.remove('c-1');

      expect(clientesServiceMock.remove).toHaveBeenCalledTimes(1);
      expect(clientesServiceMock.remove).toHaveBeenCalledWith('c-1');

      expect(res).toBeInstanceOf(SuccessResponseDto);
      expect(res.message).toBe('Cliente eliminado correctamente');
      expect(res.data).toEqual(serviceResult);
    });
  });
});
