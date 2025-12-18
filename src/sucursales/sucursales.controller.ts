import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { CreateSucursalesDto } from './dto/create-sucursales.dto';
import { UpdateSucursalesDto } from './dto/update-sucursales.dto';

@Controller('sucursales')
export class SucursalesController {
  constructor(private readonly SucursalesService: SucursalesService) {}

  @Post()
  create(@Body() createSucursalesDto: CreateSucursalesDto) {
    return this.SucursalesService.create(createSucursalesDto);
  }

  @Get()
  findAll() {
    return this.SucursalesService.findAll();
  }

  @Get(':id_sucursales')
  findOne(@Param('id_sucursales') id_sucursales: string) {
    return this.SucursalesService.findOne(id_sucursales);
  }

  @Put(':id_sucursales')
  update(@Param('id_sucursales') id_sucursales: string, @Body() UpdatesucursalesDto: UpdateSucursalesDto) {
    return this.SucursalesService.update(id_sucursales, UpdatesucursalesDto);
  }

  @Delete(':id_sucursales')
  remove(@Param('id_sucursales') id_sucursales: string) {
    return this.SucursalesService.remove(id_sucursales);
  }
}
