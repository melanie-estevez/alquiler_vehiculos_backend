import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { VehiculoService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Vehiculo } from './vehiculos.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('vehiculos')
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  
  @Post()
  async create(@Body() dto: CreateVehiculoDto) {
    const vehiculo = await this.vehiculoService.create(dto);
    if (!vehiculo) {
      throw new InternalServerErrorException('No se pudo crear el vehículo');
    }
    return new SuccessResponseDto(
      'Vehículo creado correctamente',
      vehiculo,
    );
  }

  
  @Get()
  async findAll(
    @Query() query: QueryDto,
    @Query('estado') estado?: string,
    @Query('id_sucursal') idSucursal?: string,
  ): Promise<SuccessResponseDto<Pagination<Vehiculo>>> {
    
    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.vehiculoService.findAll(
      query,
      estado,
      idSucursal,
    );

    if (!result) {
      throw new InternalServerErrorException(
        'No se pudieron obtener los vehículos',
      );
    }

    return new SuccessResponseDto(
      'Vehículos obtenidos correctamente',
      result,
    );
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    const vehiculo = await this.vehiculoService.findOne(id);
    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }
    return new SuccessResponseDto(
      'Vehículo obtenido correctamente',
      vehiculo,
    );
  }

 
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVehiculoDto,
  ) {
    const vehiculo = await this.vehiculoService.update(id, dto);
    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }
    return new SuccessResponseDto(
      'Vehículo actualizado correctamente',
      vehiculo,
    );
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    const vehiculo = await this.vehiculoService.remove(id);
    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }
    return new SuccessResponseDto(
      'Vehículo eliminado correctamente',
      vehiculo,
    );
  }
}
