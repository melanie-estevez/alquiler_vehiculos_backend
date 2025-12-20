import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './pagos.entity';
import { Reservas } from '../reservas/reservas.entity';
import { CreatePagosDto } from './dto/create-pagos.dto';
import { UpdatePagosDto } from './dto/update-pagos.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,

    @InjectRepository(Reservas)
    private readonly reservaRepository: Repository<Reservas>,
  ) {}

  async create(dto: CreatePagosDto): Promise<Pago> {
    const { id_reserva, ...data } = dto;

    const reserva = await this.reservaRepository.findOne({
      where: { id_reserva },
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva ${id_reserva} no existe`);
    }

    const pago = this.pagoRepository.create({
      ...data,
      reserva,
    });

    return this.pagoRepository.save(pago);
  }

  async findAll(): Promise<Pago[]> {
    return this.pagoRepository.find({
      relations: ['reserva'],
    });
  }

  async findOne(id: string): Promise<Pago> {
    const pago = await this.pagoRepository.findOne({
      where: { id_pago: id },
      relations: ['reserva'],
    });

    if (!pago) {
      throw new NotFoundException(`Pago ${id} no existe`);
    }

    return pago;
  }

  async update(id: string, dto: UpdatePagosDto): Promise<Pago> {
    const pago = await this.findOne(id);
    Object.assign(pago, dto);
    return this.pagoRepository.save(pago);
  }

  async remove(id: string): Promise<void> {
    const pago = await this.findOne(id);
    await this.pagoRepository.remove(pago);
  }
}
