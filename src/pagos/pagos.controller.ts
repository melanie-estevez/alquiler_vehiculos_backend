import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagosDto } from './dto/create-pagos.dto';
import { UpdatePagosDto } from './dto/update-pagos.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('pagos')
@UseGuards(JwtAuthGuard)
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  async create(@Body() dto: CreatePagosDto) {
    return this.pagosService.create(dto);
  }

  @Get()
  async findAll() {
    return this.pagosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pagosService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePagosDto,
  ) {
    return this.pagosService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.pagosService.remove(id);
  }
}
