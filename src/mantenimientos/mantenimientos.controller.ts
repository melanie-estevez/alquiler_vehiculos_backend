import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MantenimientoService } from './mantenimientos.service';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';

@Controller('mantenimientos')
export class MantenimientoController {
  constructor(private readonly mantenimientoService: MantenimientoService) {}

  @Post()
  create(@Body() createMantenimientoDto: CreateMantenimientoDto) {
    return this.mantenimientoService.create(createMantenimientoDto);
  }

  @Get()
  findAll() {
    return this.mantenimientoService.findAll();
  }

  @Get(':id_mantenimiento')
  findOne(@Param('id_mantenimiento') id_mantenimiento: string) {
    return this.mantenimientoService.findOne(id_mantenimiento);
  }

  @Put(':id_mantenimiento')
  update(
    @Param('id_mantenimiento') id_mantenimiento: string,
    @Body() updateMantenimientoDto: UpdateMantenimientoDto,
  ) {
    return this.mantenimientoService.update(id_mantenimiento, updateMantenimientoDto);
  }

  @Delete(':id_mantenimiento')
  remove(@Param('id_mantenimiento') id_mantenimiento: string) {
    return this.mantenimientoService.remove(id_mantenimiento);
  }
}