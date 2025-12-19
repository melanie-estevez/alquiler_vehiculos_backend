import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ReservaService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservaService.create(createReservaDto);
  }

  @Get()
  findAll() {
    return this.reservaService.findAll();
  }

  @Get(':id_reserva')
  findOne(@Param('id_reserva') id_reserva: string) {
    return this.reservaService.findOne(id_reserva);
  }

  @Put(':id_reserva')
  update(@Param('id_reserva') id_reserva: string, @Body() UpdatereservaDto: UpdateReservaDto) {
    return this.reservaService.update(id_reserva, UpdatereservaDto);
  }

  @Delete(':id_reserva')
  remove(@Param('id_reserva') id_reserva: string) {
    return this.reservaService.remove(id_reserva);
  }
}
