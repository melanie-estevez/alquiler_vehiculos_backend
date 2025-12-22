import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { DetallesFacturaService } from './detalle_factura.service';
import { CreateDetalleFacturaDto } from './dto/create-detalle_factura.dto';
import { UpdateDetalleFacturaDto } from './dto/update-detalle_factura.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('detallesfactura')
export class DetallesFacturaController {
  constructor(
    private readonly detallesfacturaService: DetallesFacturaService,
  ) {}

  @Post()
  async create(@Body() dto: CreateDetalleFacturaDto) {
    const data = await this.detallesfacturaService.create(dto);
    return {
      success: true,
      message: 'Detalle de factura creado correctamente',
      data,
    };
  }

  @Get()
  async findAll(@Query() queryDto: QueryDto) {
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;
    const data = await this.detallesfacturaService.findAll(queryDto);
    return {
      success: true,
      message: 'Listado de detalles de factura',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.detallesfacturaService.findOne(id);
    return {
      success: true,
      message: 'Detalle de factura encontrado',
      data,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDetalleFacturaDto,
  ) {
    const data = await this.detallesfacturaService.update(id, dto);
    return {
      success: true,
      message: 'Detalle de factura actualizado',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.detallesfacturaService.remove(id);
    return {
      success: true,
      message: 'Detalle de factura eliminado',
      data,
    };
  }
}
