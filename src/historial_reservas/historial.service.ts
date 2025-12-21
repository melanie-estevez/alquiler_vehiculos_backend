import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Historial } from './schemas/historial.schema';
import { CreateHistorialDto } from './dto/create-historial.dto';

@Injectable()
export class HistorialService {
  constructor(
    @InjectModel(Historial.name)
    private readonly historialModel: Model<Historial>,
  ) {}

  async create(createHistorialDto: CreateHistorialDto): Promise<Historial> {
    const historial = new this.historialModel({
      id_reserva: createHistorialDto.id_reserva,
      estado_anterior: createHistorialDto.estado_anterior,
      estado_nuevo: createHistorialDto.estado_nuevo,
      fecha: new Date(createHistorialDto.fecha),
    });

    return historial.save();
  }

  async findAll(): Promise<Historial[]> {
    return this.historialModel
      .find()
      .sort({ fecha: -1 })
      .exec();
  }

  async findByReserva(id_reserva: string): Promise<Historial[]> {
    return this.historialModel
      .find({ id_reserva })
      .sort({ fecha: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Historial | null> {
    return this.historialModel.findById(id).exec();
  }

  async delete(id: string): Promise<Historial | null> {
    return this.historialModel.findByIdAndDelete(id).exec();
  }
}
