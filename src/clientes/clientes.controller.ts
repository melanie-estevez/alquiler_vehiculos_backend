import { Controller, Get, Post, Body, Param, Put, Delete, Req, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

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

  @Get()
  findAll() {
    return this.clientesService.findAll();
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