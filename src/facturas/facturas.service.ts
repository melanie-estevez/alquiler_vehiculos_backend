import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './factura.entity';
import { DetalleFactura } from '../detalle_factura/detalle_factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Reservas } from '../reservas/reservas.entity';
import { Cliente } from '../clientes/cliente.entity';
import { EstadoFactura } from './enums/estado-factura.enum';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,

    @InjectRepository(DetalleFactura)
    private readonly detalleRepo: Repository<DetalleFactura>,

    @InjectRepository(Reservas)
    private readonly reservaRepo: Repository<Reservas>,

    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
  ) {}

  private handleDbError(error: any, msg: string): never {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException ||
      error instanceof ForbiddenException
    ) {
      throw error;
    }
    console.error(error);
    throw new InternalServerErrorException(msg);
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Factura>> {
    try {
      const { page, limit, search } = queryDto;

      const qb = this.facturaRepo
        .createQueryBuilder('factura')
        .leftJoinAndSelect('factura.cliente', 'cliente')
        .leftJoinAndSelect('factura.reserva', 'reserva');

      if (search) {
        qb.andWhere(
          `(
            factura.id_factura::text ILIKE :search
            OR factura.estado::text ILIKE :search
            OR cliente.name ILIKE :search
            OR cliente.apellido ILIKE :search
            OR cliente.cedula ILIKE :search
            OR cliente.email ILIKE :search
            OR cliente.celular ILIKE :search
            OR cliente.ciudad ILIKE :search
          )`,
          { search: `%${search}%` },
        );
      }

      return await paginate(qb, { page, limit: limit > 100 ? 100 : limit });
    } catch (error) {
      throw this.handleDbError(error, 'Error al listar facturas');
    }
  }

  async create(dto: CreateFacturaDto): Promise<Factura> {
    try {
      const reserva = await this.reservaRepo.findOne({
        where: { id_reserva: dto.id_reserva },
        relations: ['cliente'],
      });
      if (!reserva) throw new NotFoundException('Reserva no existe');

      const cliente = await this.clienteRepo.findOne({
        where: { id: dto.id_cliente },
      });
      if (!cliente) throw new NotFoundException('Cliente no existe');

      let subtotal = 0;

      const detalles = (dto.detalles ?? []).map((d) => {
        const total = Number(d.cantidad) * Number(d.precio_unitario);
        subtotal += total;
        return this.detalleRepo.create({ ...d, total });
      });

      if (!detalles.length) {
        throw new BadRequestException('La factura debe tener detalles');
      }

      const iva = Number((subtotal * 0.15).toFixed(2));
      const total = Number((subtotal + iva).toFixed(2));

      const factura = this.facturaRepo.create({
        reserva,
        cliente,
        subtotal,
        iva,
        total,
        estado: dto.estado ?? EstadoFactura.PENDIENTE,
        detalles,
      });

      return await this.facturaRepo.save(factura);
    } catch (error) {
      throw this.handleDbError(error, 'Error al crear factura');
    }
  }

  async getOrCreateByReserva(reservaId: string, userId: string): Promise<Factura> {
    try {
      const reserva = await this.reservaRepo.findOne({
        where: { id_reserva: reservaId },
        relations: ['cliente', 'vehiculo'],
      });

      if (!reserva) throw new NotFoundException('Reserva no existe');

      const existente = await this.facturaRepo.findOne({
        where: { reserva: { id_reserva: reservaId } },
        relations: ['detalles', 'cliente', 'reserva', 'pagos'],
      });

      if (existente) return existente;

      if (!reserva.cliente) {
        throw new BadRequestException('Debe completar su perfil de cliente antes de facturar');
      }

      const clienteDelUsuario = await this.clienteRepo.findOne({
        where: { id: reserva.cliente.id },
        relations: ['user'],
      });

      const ownerUserId = String(clienteDelUsuario?.user?.id ?? '');
      if (!ownerUserId) {
        throw new BadRequestException('El perfil de cliente no está vinculado a un usuario');
      }

      if (String(ownerUserId) !== String(userId)) {
        throw new ForbiddenException('No puede facturar una reserva que no le pertenece');
      }

      const subtotal = Number(reserva.total ?? 0);
      if (!Number.isFinite(subtotal) || subtotal <= 0) {
        throw new BadRequestException('La reserva no tiene un total válido para facturar');
      }

      const iva = Number((subtotal * 0.15).toFixed(2));
      const total = Number((subtotal + iva).toFixed(2));

      const detalle = this.detalleRepo.create({
        descripcion: `Reserva ${reserva.id_reserva}`,
        cantidad: 1,
        precio_unitario: subtotal,
        total: subtotal,
      });

      const factura = this.facturaRepo.create({
        reserva,
        cliente: reserva.cliente,
        subtotal,
        iva,
        total,
        estado: EstadoFactura.PENDIENTE,
        detalles: [detalle],
      });

      return await this.facturaRepo.save(factura);
    } catch (error) {
      throw this.handleDbError(error, 'Error al obtener o crear factura por reserva');
    }
  }

  async findOne(id: string): Promise<Factura> {
    try {
      const factura = await this.facturaRepo.findOne({
        where: { id_factura: id },
        relations: ['detalles', 'cliente', 'reserva', 'pagos'],
      });

      if (!factura) throw new NotFoundException('Factura no encontrada');
      return factura;
    } catch (error) {
      throw this.handleDbError(error, 'Error al obtener factura');
    }
  }

  async update(id: string, dto: UpdateFacturaDto): Promise<Factura> {
    try {
      const factura = await this.facturaRepo.findOne({
        where: { id_factura: id },
      });

      if (!factura) throw new NotFoundException('Factura no encontrada');

      if (dto.estado) factura.estado = dto.estado;

      return await this.facturaRepo.save(factura);
    } catch (error) {
      throw this.handleDbError(error, 'Error al actualizar factura');
    }
  }

  async remove(id: string) {
    try {
      const factura = await this.facturaRepo.findOne({
        where: { id_factura: id },
      });

      if (!factura) throw new NotFoundException('Factura no encontrada');

      await this.facturaRepo.remove(factura);
      return { message: 'Factura eliminada correctamente' };
    } catch (error) {
      throw this.handleDbError(error, 'Error al eliminar factura');
    }
  }
}
