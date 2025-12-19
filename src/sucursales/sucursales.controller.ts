import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { CreateSucursalesDto } from './dto/create-sucursales.dto';
import { UpdateSucursalesDto } from './dto/update-sucursales.dto';

@Controller('sucursales')
export class SucursalesController {
  constructor(
    private readonly sucursalesService: SucursalesService,
  ) {}

  @Post()
  create(@Body() dto: CreateSucursalesDto) {
    return this.sucursalesService.create(dto);
  }

  @Get()
  findAll() {
    return this.sucursalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sucursalesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSucursalesDto,
  ) {
    return this.sucursalesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sucursalesService.remove(id);
  }
}
