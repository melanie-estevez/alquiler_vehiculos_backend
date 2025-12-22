import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Historial } from './schemas/historial.schema';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';
    @Injectable()
    export class HistorialService {
      remove(id: string) {
        throw new Error('Method not implemented.');
      }
      constructor(
        @InjectModel(Historial.name)
        private readonly historialModel: Model<Historial>,
      ) {}
      async create(createHistorialDto: CreateHistorialDto): Promise<Historial> {
        try {
        const historial = new this.historialModel({
          id_reserva: createHistorialDto.id_reserva,
          estado_anterior: createHistorialDto.estado_anterior,
          estado_nuevo: createHistorialDto.estado_nuevo,
          fecha: new Date(createHistorialDto.fecha),
        });
        return await historial.save();
        } catch (error){
          console.error(error);
          throw new InternalServerErrorException('Error al crear historial de reserva')
        }
      }
    async findAll(options: {page: number;limit: number;search?: string;searchField?: 'id_reserva' | 'estado_anterior' | 'estado_nuevo';
    }): Promise<{items: Historial[];total: number;page: number;limit: number;}> {
    try {
    const { page, limit, search, searchField } = options;
    const filter: any = {};
    if (search) {
      if (searchField) {
        filter[searchField] = { $regex: search, $options: 'i' };
      } else {
        filter.$or = [
          { id_reserva: { $regex: search, $options: 'i' } },
          { estado_anterior: { $regex: search, $options: 'i' } },
          { estado_nuevo: { $regex: search, $options: 'i' } },
        ];
      }
    }
      const total = await this.historialModel.countDocuments(filter);
      const items = await this.historialModel
        .find(filter)
        .sort({ fecha: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      return {items,total,page,limit,};
    } catch (error) {
      console.error(error);
        throw new InternalServerErrorException('Error al obtener el historial');
      }
    }
      async findByReserva(id_reserva: string): Promise<Historial[]> {
      try {
        return await this.historialModel
          .find({ id_reserva })
          .sort({ fecha: -1 })
          .exec();
      } catch (error) {
        throw new InternalServerErrorException('Error al buscar el historial')
      }
    }
      async findOne(id: string): Promise<Historial | null> {
        return this.historialModel.findById(id).exec();
      }
      async update(id: string, dto: UpdateHistorialDto): Promise<Historial> {
      try {
      const historial = await this.historialModel.findByIdAndUpdate(id,{ $set: dto },{ new: true },).exec();
      if (!historial) {
          throw new NotFoundException('Historial no encontrado');
     }
     return historial;
      } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el historial')
      }
    }
      async delete(id: string): Promise<Historial | null> {
        return this.historialModel.findByIdAndDelete(id).exec();
      }
    }