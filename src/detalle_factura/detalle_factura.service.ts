import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleFactura } from './detalle_factura.entity';
import { CreateDetalleFacturaDto } from './dto/create-detalle_factura.dto';
import { UpdateDetalleFacturaDto } from './dto/update-detalle_factura.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class DetallesFacturaService {
  constructor(
    @InjectRepository(DetalleFactura)
    private readonly detallefacturaRepository: Repository<DetalleFactura>,
  ) {}
  
  async findAll(options: IPaginationOptions): Promise<Pagination<DetalleFactura>> {
    const queryBuilder = this.detallefacturaRepository.createQueryBuilder('detallefactura');
    return paginate<DetalleFactura>(queryBuilder, options);
  }
  create(createDetalleFacturaDto: CreateDetalleFacturaDto) {
    const detallefactura = this.detallefacturaRepository.create(createDetalleFacturaDto);
    return this.detallefacturaRepository.save(detallefactura);
  }


  findOne(id_detalle: string) {
    return this.detallefacturaRepository.findOne({ where: { id_detalle} });
  }

  async update(id_detalle: string, updateDetalleFacturaDto: UpdateDetalleFacturaDto) {
    const detallefactura = await this.detallefacturaRepository.findOne({ where: { id_detalle } });
    if (!detallefactura) return null;
    Object.assign(detallefactura, updateDetalleFacturaDto);
    return this.detallefacturaRepository.save(detallefactura);
  }

  async remove(id_detalle: string) {
    const detallefactura = await this.detallefacturaRepository.findOne({ where: { id_detalle }});
    if (!detallefactura) return null;
    return this.detallefacturaRepository.remove(detallefactura);
  }
}
