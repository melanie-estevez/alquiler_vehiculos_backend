import { Controller, Get, Post, Body, Param, Put, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Cliente } from './cliente.entity';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Cliente>> {
    limit = limit > 100 ? 100 : limit;
    return this.clientesService.findAll({ page, limit });
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  createMe(@Req() req: any, @Body() dto: CreateClienteDto) {
    return this.clientesService.createForUser(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.clientesService.findByUserId(req.user.sub);
  }

  @Post()
  create(@Body() dto: CreateClienteDto) {
    return this.clientesService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    return this.clientesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(id);
  }
}