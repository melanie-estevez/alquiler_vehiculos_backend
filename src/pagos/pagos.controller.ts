import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagosDto } from './dto/create-pagos.dto';
import { UpdatePagosDto } from './dto/update-pagos.dto';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  create(@Body() createPagosDto: CreatePagosDto) {
    return this.pagosService.create(createPagosDto);
  }

  @Get()
  findAll() {
    return this.pagosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePagosDto: UpdatePagosDto) {
    return this.pagosService.update(id, updatePagosDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagosService.remove(id);
  }
}
