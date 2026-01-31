import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pago } from './pagos.entity';
import { CreatePagosDto } from './dto/create-pagos.dto';
import { UpdatePagosDto } from './dto/update-pagos.dto';

import { Factura } from 'src/facturas/factura.entity';
import { Reservas } from 'src/reservas/reservas.entity';

import { EstadoFactura } from 'src/facturas/enums/estado-factura.enum';
import { EstadoReserva } from 'src/reservas/enums/estado-reserva.enum';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagosRepository: Repository<Pago>,

    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,

    @InjectRepository(Reservas)
    private readonly reservaRepo: Repository<Reservas>,
  ) {}

  private handleDbError(error: any, msg: string): never {
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }
    console.error(error);
    throw new InternalServerErrorException(msg);
  }

  async create(dto: CreatePagosDto) {
    try {
      const { id_factura, metodo } = dto;

      if (!id_factura) throw new BadRequestException('Falta id_factura');
      if (!metodo) throw new BadRequestException('Falta método de pago');

      const factura = await this.facturaRepo.findOne({
        where: { id_factura },
        relations: ['reserva'],
      });

      if (!factura) throw new NotFoundException('Factura no encontrada');

      if (factura.estado === EstadoFactura.PAGADO) {
        throw new BadRequestException('Esta factura ya fue pagada');
      }

      const existePago = await this.pagosRepository.count({
        where: { factura: { id_factura } } as any,
      });

      if (existePago > 0) {
        throw new BadRequestException('Esta factura ya tiene un pago registrado');
      }

      const pago = this.pagosRepository.create({
        metodo,
        estado: 'PAGADO',              // ✅ CLAVE
        monto: Number(factura.total),
        fecha_pago: new Date(),        // ✅ Date real
      });

      pago.factura = factura;
      pago.reserva = factura.reserva;

      const pagoGuardado = await this.pagosRepository.save(pago);

      await this.facturaRepo.update(id_factura, {
        estado: EstadoFactura.PAGADO,
      });

      await this.reservaRepo.update(factura.reserva.id_reserva, {
        estado: EstadoReserva.CONFIRMADA,
      });

      return pagoGuardado;
    } catch (error) {
      throw this.handleDbError(error, 'Error al registrar el pago');
    }
  }

  async findAll() {
    try {
      return await this.pagosRepository.find({
        relations: ['factura', 'reserva'],
      });
    } catch (error) {
      throw this.handleDbError(error, 'Error al listar pagos');
    }
  }

  async findOne(id_pago: string) {
    try {
      const pago = await this.pagosRepository.findOne({
        where: { id_pago },
        relations: ['factura', 'reserva'],
      });

      if (!pago) throw new NotFoundException('Pago no encontrado');
      return pago;
    } catch (error) {
      throw this.handleDbError(error, 'Error al obtener pago');
    }
  }

  async update(id: string, updatePagoDto: UpdatePagosDto) {
    try {
      const pago = await this.findOne(id);
      Object.assign(pago, updatePagoDto);
      return await this.pagosRepository.save(pago);
    } catch (error) {
      throw this.handleDbError(error, 'Error al actualizar pago');
    }
  }

  async remove(id: string) {
    try {
      const pago = await this.findOne(id);
      return await this.pagosRepository.remove(pago);
    } catch (error) {
      throw this.handleDbError(error, 'Error al eliminar pago');
    }
  }
}
