import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { CreateSucursalesDto } from './dto/create-sucursales.dto';
import { UpdateSucursalesDto } from './dto/update-sucursales.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { mapSucursalToResponse } from './sucursales.mapper';

@Controller('sucursales')
export class SucursalesController {
  constructor(private readonly sucursalesService: SucursalesService) {}

  @Post()
  async create(@Body() dto: CreateSucursalesDto) {
    const sucursal = await this.sucursalesService.create(dto);
    return new SuccessResponseDto(
      'Sucursal creada correctamente',
      mapSucursalToResponse(sucursal),
    );
  }

  @Get()
  async findAll() {
    const sucursales = await this.sucursalesService.findAll();
    const data = sucursales.map(mapSucursalToResponse);

    return new SuccessResponseDto('Sucursales obtenidas', data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sucursal = await this.sucursalesService.findOne(id);

    if (!sucursal) throw new NotFoundException('Sucursal no encontrada');

    return new SuccessResponseDto(
      'Sucursal encontrada',
      mapSucursalToResponse(sucursal),
    );
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSucursalesDto) {
    const sucursal = await this.sucursalesService.update(id, dto);

    return new SuccessResponseDto(
      'Sucursal actualizada correctamente',
      mapSucursalToResponse(sucursal),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.sucursalesService.remove(id);

    return new SuccessResponseDto('Sucursal eliminada', null);
  }
}
