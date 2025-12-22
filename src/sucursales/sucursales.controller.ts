import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { CreateSucursalesDto } from './dto/create-sucursales.dto';
import { UpdateSucursalesDto } from './dto/update-sucursales.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('sucursales')
export class SucursalesController {
  constructor(private readonly sucursalesService: SucursalesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateSucursalesDto) {
    const sucursal = await this.sucursalesService.create(dto);

    return new SuccessResponseDto(
      'Sucursal creada correctamente',
      sucursal,
    );
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    const result = await this.sucursalesService.findAll(query);

    return new SuccessResponseDto('Sucursales obtenidas', {
      items: result.items,
      meta: result.meta,
      links: result.links,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sucursal = await this.sucursalesService.findOne(id);

    return new SuccessResponseDto(
      'Sucursal encontrada',
      sucursal,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSucursalesDto) {
    const sucursal = await this.sucursalesService.update(id, dto);

    return new SuccessResponseDto(
      'Sucursal actualizada correctamente',
      sucursal,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.sucursalesService.remove(id);

    return new SuccessResponseDto('Sucursal eliminada', null);
  }
}
