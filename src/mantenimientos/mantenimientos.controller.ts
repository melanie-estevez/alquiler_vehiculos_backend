import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MantenimientoService } from './mantenimientos.service';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('mantenimientos')
export class MantenimientoController {
  constructor(
    private readonly mantenimientoService: MantenimientoService,
  ) {}

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
    // límite de seguridad
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

  @Delete(':id_mantenimiento')
  async remove(@Param('id_mantenimiento') id_mantenimiento: string) {
    await this.mantenimientoService.remove(id_mantenimiento);

    return new SuccessResponseDto(
      'Mantenimiento eliminado correctamente',
      null,
    );
  }
}
