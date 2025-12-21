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

  async create(dto: CreateAlquilerDto) {
    const alquiler = this.alquilerRepository.create({
      fecha_entrega: new Date(dto.fecha_entrega),
      fecha_devolucion: new Date(dto.fecha_devolucion),
      km_inicial: dto.km_inicial,
      km_final: dto.km_final,
      estado: dto.estado,
      reserva: { id_reserva: dto.id_reserva } as any, 
    });

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
