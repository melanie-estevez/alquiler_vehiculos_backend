import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './factura.entity';
import { DetalleFactura } from 'src/detalle_factura/detalle_factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { Reservas } from '../reservas/reservas.entity';
import { Cliente } from '../clientes/cliente.entity';
import { EstadoFactura } from './enums/estado-factura.enum';


@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private facturaRepo: Repository<Factura>,
    @InjectRepository(DetalleFactura)
    private detalleRepo: Repository<DetalleFactura>,
    @InjectRepository(Reservas)
    private reservaRepo: Repository<Reservas>,
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
  ) {}

  async create(dto: CreateFacturaDto): Promise<Factura> {
    const reserva = await this.reservaRepo.findOne({ where: { id_reserva: dto.id_reserva } });
    const cliente = await this.clienteRepo.findOne({ where: { id: dto.id_cliente } });

    if (!reserva || !cliente) throw new NotFoundException('Reserva o Cliente no existe');

    let subtotal = 0;

    const detalles = dto.detalles.map(d => {
      const total = d.cantidad * d.precio_unitario;
      subtotal += total;
      return this.detalleRepo.create({ ...d, total });
    });

    const iva = subtotal * 0.12;
    const total = subtotal + iva;

    const factura = this.facturaRepo.create({
      id_reserva: reserva,
      id_cliente: cliente,
      subtotal,
      iva,
      total,
      estado: dto.estado ?? EstadoFactura.PENDIENTE,
      detalles,
    });


    return this.facturaRepo.save(factura);
  }

  findAll() {
    return this.facturaRepo.find({ relations: ['detalles', 'id_cliente', 'id_reserva'] });
  }

  findOne(id: string) {
    return this.facturaRepo.findOne({
      where: { id_factura: id },
      relations: ['detalles', 'id_cliente', 'id_reserva'],
    });
  }
}
