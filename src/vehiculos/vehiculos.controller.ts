import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { VehiculoService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { mapVehiculoToResponse } from './vehiculos.mapper';

@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  @Post()
  async create(@Body() dto: CreateVehiculoDto) {
    const vehiculo = await this.vehiculoService.create(dto);

    return new SuccessResponseDto(
      'Vehículo creado correctamente',
      mapVehiculoToResponse(vehiculo),
    );
  }

  @Get()
  async findAll() {
    const vehiculos = await this.vehiculoService.findAll();
    const data = vehiculos.map(mapVehiculoToResponse);

    return new SuccessResponseDto(
      'Vehículos obtenidos correctamente',
      data,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const vehiculo = await this.vehiculoService.findOne(id);

    return new SuccessResponseDto(
      'Vehículo obtenido correctamente',
      mapVehiculoToResponse(vehiculo),
    );
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateVehiculoDto) {
    const vehiculo = await this.vehiculoService.update(id, dto);

    return new SuccessResponseDto(
      'Vehículo actualizado correctamente',
      mapVehiculoToResponse(vehiculo),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.vehiculoService.remove(id);

    return new SuccessResponseDto(
      'Vehículo eliminado correctamente',
      null,
    );
  }
}
