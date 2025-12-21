import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Factura } from './factura.entity';

@Controller('facturas')
export class FacturasController {
  constructor(private readonly service: FacturasService) {}

  @Post()
  create(@Body() dto: CreateFacturaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Factura>> {
    limit = limit > 100 ? 100 : limit;
    return this.service.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
