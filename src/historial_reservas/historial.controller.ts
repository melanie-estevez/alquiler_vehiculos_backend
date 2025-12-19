import {
  Controller, Get, Post, Put, Delete, Param, Body, Query, NotFoundException, InternalServerErrorException
} from '@nestjs/common';
import { HistorialService } from './historial.service';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

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
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<any>> {
    const result = await this.historialService.findAll({ page, limit });
    if (!result) throw new InternalServerErrorException('Could not retrieve courses');
    return new SuccessResponseDto('Courses retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const historial = await this.historialService.findOne(id);
    if (!historial) throw new NotFoundException('Course not found');
    return new SuccessResponseDto('Course retrieved successfully', historial);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateHistorialDto) {
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

