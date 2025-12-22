import {Controller,Get,Post,Put,Delete,Param,Body,Query,NotFoundException,InternalServerErrorException,
} from '@nestjs/common';
import { Historial_usuarioService } from './historial_usuario.service';
import { CreateHistorial_usuarioDto } from './dto/create-historial_usuario.dto';
import { UpdateHistorial_usuarioDto } from './dto/update-historial_usuario.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('historial_usuario')
export class Historial_usuarioController {
  constructor(private readonly historial_usuarioService: Historial_usuarioService) {}

  @Post()
  async create(@Body() dto: CreateHistorial_usuarioDto) {
    const historial = await this.historial_usuarioService.create(dto);
    if (!historial) throw new InternalServerErrorException('Error al crear historial');
    return new SuccessResponseDto('Historial creado correctamente', historial);
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('searchField') searchField?: 'id_usuario' | 'id_reserva' | 'accion',
  ) {
    return this.historial_usuarioService.findAll({
      page: Number(page),
      limit: Number(limit),
      search,
      searchField,
    });
  }

  @Get('reserva/:id_reserva')
  async findByReserva(@Param('id_reserva') id_reserva: string) {
    const items = await this.historial_usuarioService.findByReserva(id_reserva);
    return new SuccessResponseDto('Historial por reserva', items);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const historial = await this.historial_usuarioService.findOne(id);
    if (!historial) throw new NotFoundException('Historial no encontrado');
    return new SuccessResponseDto('Historial obtenido', historial);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateHistorial_usuarioDto) {
    const historial = await this.historial_usuarioService.update(id, dto);
    if (!historial) throw new NotFoundException('Historial no encontrado');
    return new SuccessResponseDto('Historial actualizado', historial);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.historial_usuarioService.remove(id);
    return new SuccessResponseDto('Historial eliminado', true);
  }
}