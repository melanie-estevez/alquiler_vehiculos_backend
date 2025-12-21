import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { DetallesFacturaService } from './detalle_factura.service';
import { CreateDetalleFacturaDto } from './dto/create-detalle_factura.dto';
import { UpdateDetalleFacturaDto } from './dto/update-detalle_factura.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DetalleFactura } from './detalle_factura.entity';

@Controller('detallesfactura')
export class DetallesFacturaController {
  constructor(private readonly detallesfacturaService: DetallesFacturaService) {}

  @Post()
  create(@Body() createDetalleFacturaDto: CreateDetalleFacturaDto) {
    return this.detallesfacturaService.create(createDetalleFacturaDto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<DetalleFactura>> {
    limit = limit > 100 ? 100 : limit;
    return this.detallesfacturaService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallesfacturaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDetalleFacturaDto: UpdateDetalleFacturaDto) {
    return this.detallesfacturaService.update(id, updateDetalleFacturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallesfacturaService.remove(id);
  }
}
