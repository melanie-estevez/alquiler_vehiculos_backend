import {
  Controller, Get, Post, Put, Delete, Param, Body, Query, NotFoundException, InternalServerErrorException
} from '@nestjs/common';
import { Historial_usuarioService } from './historial_usuario.service';
import { CreateHistorial_usuarioDto } from './dto/create-historial_usuario.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { UpdateHistorial_usuarioDto } from './dto/update-historial_usuario.dto';

@Controller('historial_usuario')
export class Historial_usuarioController {
  constructor(private readonly historial_usuarioService: Historial_usuarioService) {}

  @Post()
  async create(@Body() dto: CreateHistorial_usuarioDto) {
    const historial_usuario = await this.historial_usuarioService.create(dto);
    if (!historial_usuario ) throw new InternalServerErrorException('Failed to create course');
    return new SuccessResponseDto('Course created successfully', historial_usuario );
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('searchField') searchField?: 'id_usuario' | 'accion',
  ) {
     return this.historial_usuarioService.findAll({page: Number(page),limit: Number(limit),search,searchField,
    });
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const historial_usuario = await this.historial_usuarioService.findOne(id);
    if (!historial_usuario) throw new NotFoundException('Course not found');
    return new SuccessResponseDto('Course retrieved successfully', historial_usuario);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateHistorial_usuarioDto) {
    const historial_usuario = await this.historial_usuarioService.update(id, dto);
    if (!historial_usuario) throw new NotFoundException('Course not found');
    return new SuccessResponseDto('Course updated successfully', historial_usuario);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const historial_usuario = await this.historial_usuarioService.remove(id);
    return new SuccessResponseDto('Course deleted successfully', historial_usuario);
  }
}