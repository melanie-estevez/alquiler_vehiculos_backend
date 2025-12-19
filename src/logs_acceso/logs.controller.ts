import {
  Controller, Get, Post, Put, Delete, Param, Body, Query, NotFoundException, InternalServerErrorException
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogsDto } from './dto/create-logs.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  async create(@Body() dto: CreateLogsDto) {
    const logs = await this.logsService.create(dto);
    if (!logs) throw new InternalServerErrorException('Failed to create course');
    return new SuccessResponseDto('Course created successfully', logs);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<any>> {
    const result = await this.logsService.findAll({ page, limit });
    if (!result) throw new InternalServerErrorException('Could not retrieve courses');
    return new SuccessResponseDto('Courses retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const logs = await this.logsService.findOne(id);
    if (!logs) throw new NotFoundException('Course not found');
    return new SuccessResponseDto('Course retrieved successfully', logs);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateLogsDto) {
    const logs = await this.logsService.update(id, dto);
    if (!logs) throw new NotFoundException('Course not found');
    return new SuccessResponseDto('Course updated successfully', logs);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const logs = await this.logsService.remove(id);
    return new SuccessResponseDto('Course deleted successfully', logs);
  }
}

