import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from 'src/auth/enums/role.enum';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

jest.mock('./serializers/user.serializer', () => ({
  UserSerializer: function (this: any, user: any) {
    Object.assign(this, { id: user?.id, email: user?.email, role: user?.role });
  },
}));

describe('UsersController', () => {
  let controller: UsersController;
  const usersServiceMock = {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateRole: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('debe limitar el límite a 100 y devolver SuccessResponseDto con elementos serializados', async () => {
      const queryDto: any = {
        page: 1,
        limit: 999, 
        search: 'test',
        searchField: 'email',
        sort: 'email',
        order: 'ASC',
      };

      const serviceResult = {
        items: [
          { id: '1', email: 'a@test.com', role: Role.USER },
          { id: '2', email: 'b@test.com', role: Role.ADMIN },
        ],
        meta: { totalItems: 2, itemCount: 2, itemsPerPage: 100, totalPages: 1, currentPage: 1 },
        links: { first: '', previous: '', next: '', last: '' },
      };

      usersServiceMock.findAll.mockResolvedValue(serviceResult);

      const res: any = await controller.findAll(queryDto);

      expect(queryDto.limit).toBe(100);

      expect(usersServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.findAll).toHaveBeenCalledWith(queryDto);

      expect(res).toBeInstanceOf(SuccessResponseDto);
      expect(res.message).toBe('Listado de usuarios');

      expect(res.data.items).toEqual([
        { id: '1', email: 'a@test.com', role: Role.USER },
        { id: '2', email: 'b@test.com', role: Role.ADMIN },
      ]);

      expect(res.data.meta).toEqual(serviceResult.meta);
      expect(res.data.links).toEqual(serviceResult.links);
    });
  });

  describe('create', () => {
    it('debe crear un usuario y devolver SuccessResponseDto con el usuario serializado', async () => {
      const dto: any = { email: 'new@test.com', password: '123456', role: Role.USER };
      const createdUser = { id: '10', email: dto.email, role: dto.role };

      usersServiceMock.create.mockResolvedValue(createdUser);

      const res: any = await controller.create(dto);

      expect(usersServiceMock.create).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.create).toHaveBeenCalledWith(dto);

      expect(res).toBeInstanceOf(SuccessResponseDto);
      expect(res.message).toBe('Usuario creado correctamente');
      expect(res.data).toEqual({ id: '10', email: 'new@test.com', role: Role.USER });
    });
  });

  describe('findOne', () => {
    it('debe devolver SuccessResponseDto con el usuario serializado', async () => {
      const user = { id: '1', email: 'one@test.com', role: Role.USER };
      usersServiceMock.findOne.mockResolvedValue(user);

      const res: any = await controller.findOne('1');

      expect(usersServiceMock.findOne).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.findOne).toHaveBeenCalledWith('1');

      expect(res).toBeInstanceOf(SuccessResponseDto);
      expect(res.message).toBe('Usuario encontrado');
      expect(res.data).toEqual({ id: '1', email: 'one@test.com', role: Role.USER });
    });
  });

  describe('update', () => {
    it('debe actualizar el usuario y devolver SuccessResponseDto con el usuario serializado', async () => {
      const id = '1';
      const dto: any = { email: 'updated@test.com' };
      const updatedUser = { id, email: dto.email, role: Role.USER };

      usersServiceMock.update.mockResolvedValue(updatedUser);

      const res: any = await controller.update(id, dto);

      expect(usersServiceMock.update).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.update).toHaveBeenCalledWith(id, dto);

      expect(res).toBeInstanceOf(SuccessResponseDto);
      expect(res.message).toBe('Usuario actualizado correctamente');
      expect(res.data).toEqual({ id: '1', email: 'updated@test.com', role: Role.USER });
    });
  });

  describe('updateRole', () => {
    it('debe actualizar el rol y devolver SuccessResponseDto con el usuario serializado', async () => {
      const id = '1';
      const newRole = Role.ADMIN;
      const updatedUser = { id, email: 'x@test.com', role: newRole };

      usersServiceMock.updateRole.mockResolvedValue(updatedUser);

      const res: any = await controller.updateRole(id, newRole);

      expect(usersServiceMock.updateRole).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.updateRole).toHaveBeenCalledWith(id, newRole);

      expect(res).toBeInstanceOf(SuccessResponseDto);
      expect(res.message).toBe('Rol actualizado correctamente');
      expect(res.data).toEqual({ id: '1', email: 'x@test.com', role: Role.ADMIN });
    });
  });

  describe('remove', () => {
    it('debe eliminar el usuario y devolver SuccessResponseDto con datos nulos', async () => {
      const id = '1';
      usersServiceMock.remove.mockResolvedValue({ message: 'Usuario eliminado' });

      const res: any = await controller.remove(id);

      expect(usersServiceMock.remove).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.remove).toHaveBeenCalledWith(id);

      expect(res).toBeInstanceOf(SuccessResponseDto);
      expect(res.message).toBe('Usuario eliminado correctamente');
      expect(res.data).toBeNull();
    });
  });
});
