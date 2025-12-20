import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { MantenimientoService } from './mantenimientos.service';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { MantenimientoQueryDto } from './dto/mantenimiento-query.dto';
import { mapMantenimientoToResponse } from './mantenimientos.mapper';

@Controller('mantenimientos')
export class MantenimientoController {
  constructor(private readonly service: MantenimientoService) {}

  @Post()
  async create(@Body() dto: CreateMantenimientoDto) {
    const mantenimiento = await this.service.create(dto);
    return new SuccessResponseDto(
      'Mantenimiento registrado correctamente',
      mapMantenimientoToResponse(mantenimiento),
    );
  }

  @Get()
  async findAll(@Query() query: MantenimientoQueryDto) {
    const result = await this.service.findAll(query);

    return new SuccessResponseDto('Lista paginada', {
      ...result,
      data: result.data.map(mapMantenimientoToResponse),
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const mantenimiento = await this.service.findOne(id);
    return new SuccessResponseDto(
      'Mantenimiento encontrado',
      mapMantenimientoToResponse(mantenimiento),
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMantenimientoDto,
  ) {
    const mantenimiento = await this.service.update(id, dto);
    return new SuccessResponseDto(
      'Mantenimiento actualizado',
      mapMantenimientoToResponse(mantenimiento),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return new SuccessResponseDto('Mantenimiento eliminado', true);
  }
}
