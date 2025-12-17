import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alquiler } from './alquiler.entity';
import { CreateAlquilerDto } from './dto/create-alquiler.dto';
import { UpdateAlquilerDto } from './dto/update-alquiler.dto';

@Injectable()
export class AlquilerService {
  constructor(
    @InjectRepository(Alquiler)
    private readonly alquilerRepository: Repository<Alquiler>,
  ) {}

  async create(createAlquilerDto: CreateAlquilerDto) {
    const alquiler = this.alquilerRepository.create(createAlquilerDto);
    return this.alquilerRepository.save(alquiler);
  }

  findAll() {
    return this.alquilerRepository.find();
  }

  async findOne(id_alquiler: string) {
    const alquiler = await this.alquilerRepository.findOne({ where: { id_alquiler } });
    if (!alquiler) throw new NotFoundException('Alquiler no encontrado');
    return alquiler;
  }

  async update(id: string, updateAlquilerDto: UpdateAlquilerDto) {
    const alquiler = await this.findOne(id);
    Object.assign(alquiler, updateAlquilerDto);
    return this.alquilerRepository.save(alquiler);
  }

  async remove(id: string) {
    const alquiler = await this.findOne(id);
    return this.alquilerRepository.remove(alquiler);
  }
}
