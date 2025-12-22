import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './pagos.entity';
import { CreatePagosDto } from './dto/create-pagos.dto';
import { UpdatePagosDto } from './dto/update-pagos.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagosRepository: Repository<Pago>,
  ) {}

  async create(createPagosDto: CreatePagosDto) {
    const pago = this.pagosRepository.create(createPagosDto);
    return this.pagosRepository.save(pago);
  }

  findAll() {
    return this.pagosRepository.find();
  }

  async findOne(id_pago: string) {
    const pago = await this.pagosRepository.findOne({ 
      where: {id_pago: id_pago  }});
    if (!pago) throw new NotFoundException('Pago no encontrado');
    
    return this.pagosRepository.save(pago);
  }

  async update(id: string, updatePagoDto: UpdatePagosDto) {
    const pago = await this.findOne(id);
    Object.assign(pago, updatePagoDto);
    return this.pagosRepository.save(pago);
  }

  async remove(id: string) {
    const pago = await this.findOne(id);
    return this.pagosRepository.remove(pago);
  }
}