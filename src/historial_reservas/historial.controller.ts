import {
  Controller, Get, Post, Put, Delete, Param, Body, Query, NotFoundException, InternalServerErrorException
} from '@nestjs/common';
import { HistorialService } from './historial.service';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';

@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Post()
  async create(@Body() dto: CreateHistorialDto) {
    const historial = await this.historialService.create(dto);
    if (!historial) throw new InternalServerErrorException('Failed to create course');
    return new SuccessResponseDto('Course created successfully', historial);
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('searchField') searchField?: 'id_reserva' | 'estado_anterior'|'estado_nuevo',
  ) {
   return this.historialService.findAll({page: Number(page),limit: Number(limit),search,searchField,
    });
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const historial = await this.historialService.findOne(id);
    if (!historial) throw new NotFoundException('Course not found');
    return new SuccessResponseDto('Course retrieved successfully', historial);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateHistorialDto) {
    const historial = await this.historialService.update(id, dto);
    if (!historial) throw new NotFoundException('Course not found');
    return new SuccessResponseDto('Course updated successfully', historial);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const historial = await this.historialService.remove(id);
    return new SuccessResponseDto('Course deleted successfully', historial);
  }
}