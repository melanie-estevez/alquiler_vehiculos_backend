import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import type { Express } from 'express';

import { VehiculoService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Vehiculos } from './vehiculos.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { UpdateEstadoVehiculoDto } from './dto/update-estado-vehiculo.dto';
import { UpdateImagenVehiculoDto } from './dto/update-imagen-vehiculo.dto';
import { EstadoVehiculo } from './enums/estado-vehiculo.enum';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function fileName(req: any, file: any, cb: any) {
  const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, `vehiculo-${unique}${extname(file.originalname).toLowerCase()}`);
}

@Controller('vehiculos')
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateVehiculoDto) {
    const vehiculo = await this.vehiculoService.create(dto);

    if (!vehiculo) {
      throw new InternalServerErrorException('No se pudo crear el vehículo');
    }

    return new SuccessResponseDto('Vehículo creado correctamente', vehiculo);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
  ): Promise<SuccessResponseDto<Pagination<Vehiculos>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.vehiculoService.findAll(query);

    if (!result) {
      throw new InternalServerErrorException('No se pudieron obtener los vehículos');
    }

    return new SuccessResponseDto('Vehículos obtenidos correctamente', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const vehiculo = await this.vehiculoService.findOne(id);

    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return new SuccessResponseDto('Vehículo obtenido correctamente', vehiculo);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateVehiculoDto) {
    const vehiculo = await this.vehiculoService.update(id, dto);

    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return new SuccessResponseDto('Vehículo actualizado correctamente', vehiculo);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const vehiculo = await this.vehiculoService.remove(id);

    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return new SuccessResponseDto('Vehículo eliminado correctamente', vehiculo);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/estado')
  async updateEstado(@Param('id') id: string, @Body() dto: UpdateEstadoVehiculoDto) {
    if (!Object.values(EstadoVehiculo).includes(dto.estado as any)) {
      throw new BadRequestException('Estado inválido');
    }

    const vehiculo = await this.vehiculoService.updateEstado(id, dto.estado as any);

    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return new SuccessResponseDto('Estado actualizado correctamente', vehiculo);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/imagen')
  async updateImagen(@Param('id') id: string, @Body() dto: UpdateImagenVehiculoDto) {
    const vehiculo = await this.vehiculoService.updateImagenUrl(id, dto.imagen_url ?? null);

    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return new SuccessResponseDto('Imagen actualizada correctamente', vehiculo);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':id/imagen')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/vehiculos',
        filename: fileName,
      }),
      limits: { fileSize: 3 * 1024 * 1024 },
    }),
  )
  async uploadImagen(
    @Param('id') id: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('Archivo requerido');
    }

    const url = `/uploads/vehiculos/${file.filename}`;
    const data = await this.vehiculoService.updateImagenUrl(id, url);

    if (!data) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return data;
  }
}
