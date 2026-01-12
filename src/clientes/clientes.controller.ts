import {Controller,Get,Post,Body,Param,Put,Delete,Req,UseGuards,Query} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  async findAll(@Query() queryDto: QueryDto) {
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const result = await this.clientesService.findAll(queryDto);

    return new SuccessResponseDto('Listado de clientes', result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async createMe(@Req() req: any, @Body() dto: CreateClienteDto) {
    const cliente = await this.clientesService.createForUser(req.user.sub, dto);

    return new SuccessResponseDto('Cliente creado correctamente', cliente);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const cliente = await this.clientesService.findByUserId(req.user.sub);

    return new SuccessResponseDto('Cliente encontrado', cliente);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cliente = await this.clientesService.findOne(id);

    return new SuccessResponseDto('Cliente encontrado', cliente);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    const cliente = await this.clientesService.update(id, dto);

    return new SuccessResponseDto('Cliente actualizado correctamente', cliente);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.clientesService.remove(id);

    return new SuccessResponseDto('Cliente eliminado correctamente', result);
  }
}