import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { VehiculoService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@Controller('vehiculo')
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  @Post()
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculoService.create(createVehiculoDto);
  }

  @Get()
  findAll() {
    return this.vehiculoService.findAll();
  }

  @Get(':id_vehiculo')
  findOne(@Param('id_vehiculo') id_vehiculo: string) {
    return this.vehiculoService.findOne(id_vehiculo);
  }

  @Put(':id_vehiculo')
  update(@Param('id_vehiculo') id_vehiculo: string, @Body() UpdateVehiculoDto: UpdateVehiculoDto) {
    return this.vehiculoService.update(id_vehiculo, UpdateVehiculoDto);
  }

  @Delete(':id_vehiculo')
  remove(@Param('id_vehiculo') id_vehiculo: string) {
    return this.vehiculoService.remove(id_vehiculo);
  }
}
