import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ReservaService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  async create(@Body() dto: CreateReservaDto) {
    const reserva = await this.reservaService.create(dto);

    return new SuccessResponseDto(
      'Reserva creada correctamente',
      reserva,
    );
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    const result = await this.reservaService.findAll(query);

    return new SuccessResponseDto('Reservas obtenidas', {
      items: result.items,
      meta: result.meta,
      links: result.links,
    });
  }

  @Get(':id_reserva')
  async findOne(@Param('id_reserva') id: string) {
    const reserva = await this.reservaService.findOne(id);

    return new SuccessResponseDto(
      'Reserva encontrada',
      reserva,
    );
  }

  @Put(':id_reserva')
  async update(
    @Param('id_reserva') id: string,
    @Body() dto: UpdateReservaDto,
  ) {
    const reserva = await this.reservaService.update(id, dto);

    return new SuccessResponseDto(
      'Reserva actualizada correctamente',
      reserva,
    );
  }

  @Delete(':id_reserva')
  async remove(@Param('id_reserva') id: string) {
    await this.reservaService.remove(id);

    return new SuccessResponseDto(
      'Reserva eliminada correctamente',
      null,
    );
  }
}
