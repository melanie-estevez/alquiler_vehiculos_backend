import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('facturas')
export class FacturasController {
  constructor(private readonly service: FacturasService) {}

  @Post()
  async create(@Body() dto: CreateFacturaDto) {
    const factura = await this.service.create(dto);
    return new SuccessResponseDto('Factura creada correctamente', factura);
  }

  @UseGuards(JwtAuthGuard)
  @Get('reserva/:id')
  async getByReserva(@Param('id') id: string, @Req() req: any) {
    const factura = await this.service.getOrCreateByReserva(id, req.user.sub);
    return new SuccessResponseDto('Factura encontrada', factura);
  }

  @Get()
  async findAll(@Query() queryDto: QueryDto) {
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;
    const result = await this.service.findAll(queryDto);
    return new SuccessResponseDto('Listado de facturas', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const factura = await this.service.findOne(id);
    return new SuccessResponseDto('Factura encontrada', factura);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFacturaDto) {
    const factura = await this.service.update(id, dto);
    return new SuccessResponseDto('Factura actualizada correctamente', factura);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.service.remove(id);
    return new SuccessResponseDto('Factura eliminada correctamente', result);
  }
}
