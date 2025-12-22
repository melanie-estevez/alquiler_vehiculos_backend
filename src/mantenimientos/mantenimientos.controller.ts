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
import { MantenimientoService } from './mantenimientos.service';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('mantenimientos')
export class MantenimientoController {
  constructor(
    private readonly mantenimientoService: MantenimientoService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateMantenimientoDto) {
    const mantenimiento = await this.mantenimientoService.create(dto);

    return new SuccessResponseDto(
      'Mantenimiento creado correctamente',
      mantenimiento,
    );
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.mantenimientoService.findAll(query);

    return new SuccessResponseDto(
      'Mantenimientos obtenidos',
      {
        items: result.items,
        meta: result.meta,
        links: result.links,
      },
    );
  }

  @Get(':id_mantenimiento')
  async findOne(@Param('id_mantenimiento') id_mantenimiento: string) {
    const mantenimiento =
      await this.mantenimientoService.findOne(id_mantenimiento);

    return new SuccessResponseDto(
      'Mantenimiento encontrado',
      mantenimiento,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)

  @Put(':id_mantenimiento')
  async update(
    @Param('id_mantenimiento') id_mantenimiento: string,
    @Body() dto: UpdateMantenimientoDto,
  ) {
    const mantenimiento =
      await this.mantenimientoService.update(id_mantenimiento, dto);

    return new SuccessResponseDto(
      'Mantenimiento actualizado correctamente',
      mantenimiento,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id_mantenimiento')
  async remove(@Param('id_mantenimiento') id_mantenimiento: string) {
    await this.mantenimientoService.remove(id_mantenimiento);

    return new SuccessResponseDto(
      'Mantenimiento eliminado correctamente',
      null,
    );
  }
}
