import {Controller,Get,Post,Put,Delete,Body,Param,UseGuards,Query} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { UserSerializer } from './serializers/user.serializer';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() queryDto: QueryDto) {
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const result = await this.usersService.findAll(queryDto);

    return new SuccessResponseDto(
      'Listado de usuarios',
      {
        ...result,
        items: result.items.map((u) => new UserSerializer(u)),
      },
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return new SuccessResponseDto(
      'Usuario creado correctamente',
      new UserSerializer(user),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    return new SuccessResponseDto(
      'Usuario encontrado',
      new UserSerializer(user),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);

    return new SuccessResponseDto(
      'Usuario actualizado correctamente',
      new UserSerializer(user),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/role')
  async updateRole(@Param('id') id: string, @Body('role') role: Role) {
    const user = await this.usersService.updateRole(id, role);

    return new SuccessResponseDto(
      'Rol actualizado correctamente',
      new UserSerializer(user),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);

    return new SuccessResponseDto(
      'Usuario eliminado correctamente',
      null,
    );
  }
}