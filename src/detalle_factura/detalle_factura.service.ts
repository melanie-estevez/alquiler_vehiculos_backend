import {Injectable,NotFoundException,BadRequestException,InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleFactura } from './detalle_factura.entity';
import { CreateDetalleFacturaDto } from './dto/create-detalle_factura.dto';
import { UpdateDetalleFacturaDto } from './dto/update-detalle_factura.dto';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class DetallesFacturaService {
  constructor(
    @InjectRepository(DetalleFactura)
    private readonly detalleRepo: Repository<DetalleFactura>,
  ) {}

  private handleDbError(error: any, msg: string): never {
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }
    throw new InternalServerErrorException(msg);
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<DetalleFactura>> {
    try {
      const { page, limit, search } = queryDto;

      const qb = this.detalleRepo
        .createQueryBuilder('detalle')
        .leftJoinAndSelect('detalle.factura', 'factura');

      if (search) {
        qb.andWhere(
          `(
            detalle.id_detalle::text ILIKE :search
            OR detalle.descripcion ILIKE :search
            OR factura.id_factura::text ILIKE :search
          )`,
          { search: `%${search}%` },
        );
      }

      return await paginate<DetalleFactura>(qb, { page, limit });
    } catch (error) {
      throw this.handleDbError(error, 'Error al listar detalles de factura');
    }
  }

  async create(dto: CreateDetalleFacturaDto) {
    try {
      const detalle = this.detalleRepo.create(dto);
      return await this.detalleRepo.save(detalle);
    } catch (error) {
      throw this.handleDbError(error, 'Error al crear detalle de factura');
    }
  }

  async findOne(id_detalle: string) {
    try {
      const detalle = await this.detalleRepo.findOne({
        where: { id_detalle },
        relations: ['factura'],
      });
      if (!detalle) throw new NotFoundException('Detalle no encontrado');
      return detalle;
    } catch (error) {
      throw this.handleDbError(error, 'Error al obtener detalle de factura');
    }
  }

  async update(id_detalle: string, dto: UpdateDetalleFacturaDto) {
    try {
      const detalle = await this.detalleRepo.findOne({ where: { id_detalle } });
      if (!detalle) throw new NotFoundException('Detalle no encontrado');

      Object.assign(detalle, dto);
      return await this.detalleRepo.save(detalle);
    } catch (error) {
      throw this.handleDbError(error, 'Error al actualizar detalle de factura');
    }
  }

  async remove(id_detalle: string) {
    try {
      const detalle = await this.detalleRepo.findOne({ where: { id_detalle } });
      if (!detalle) throw new NotFoundException('Detalle no encontrado');

      await this.detalleRepo.remove(detalle);
      return { message: 'Detalle eliminado' };
    } catch (error) {
      throw this.handleDbError(error, 'Error al eliminar detalle de factura');
    }
  }
}
