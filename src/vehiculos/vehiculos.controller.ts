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
  UseGuards,
} from '@nestjs/common';
import { VehiculoService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Vehiculo } from './vehiculos.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('vehiculos')
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateVehiculoDto) {
    const vehiculo = await this.vehiculoService.create(dto);

    if (!vehiculo) {
      throw new InternalServerErrorException(
        'No se pudo crear el vehículo',
      );
    }

    return new SuccessResponseDto(
      'Vehículo creado correctamente',
      vehiculo,
    );
  }


  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Vehiculo>>> {

    if (query.limit && query.limit > 100) {
      query.limit = 100;
    }

    const result = await this.vehiculoService.findAll(query);

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

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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
