import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Historial_usuario } from './schemas/historial_usuario.schema';
import { CreateHistorial_usuarioDto } from './dto/create-historial_usuario.dto';
import { UpdateHistorial_usuarioDto } from './dto/update-historial_usuario.dto';

@Injectable()
export class Historial_usuarioService {
  constructor(
    @InjectModel(Historial_usuario.name)
    private readonly historialModel: Model<Historial_usuario>,
  ) {}

  async create(dto: CreateHistorial_usuarioDto): Promise<Historial_usuario> {
    try {
      const historial = new this.historialModel({
        id_reserva: dto.id_reserva,
        id_usuario: dto.id_usuario,
        accion: dto.accion,
        fecha: new Date(dto.fecha), 
      });

      return (await historial.save()).toObject();
    } catch (err) {
      console.error('Error creando historial_usuario:', err);
      throw new InternalServerErrorException('Error al crear el historial_usuario');
    }
  }

  async findAll(options: {
    page: number;
    limit: number;
    search?: string;
    searchField?: 'id_usuario' | 'id_reserva' | 'accion';
  }): Promise<{ items: Historial_usuario[]; total: number; page: number; limit: number }> {
    try {
      const { page, limit, search, searchField } = options;
      const filter: any = {};

      if (search) {
        if (searchField) {
          filter[searchField] = { $regex: search, $options: 'i' };
        } else {
          filter.$or = [
            { id_usuario: { $regex: search, $options: 'i' } },
            { id_reserva: { $regex: search, $options: 'i' } },
            { accion: { $regex: search, $options: 'i' } },
          ];
        }
      }

      const total = await this.historialModel.countDocuments(filter);

      const items = (await this.historialModel
        .find(filter)
        .sort({ fecha: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        ).map(doc => doc.toObject());
      return { items, total, page, limit };
    } catch (err) {
      console.error('Error retrieving historial_usuario:', err);
      throw new InternalServerErrorException('Error al obtener historial_usuario');
    }
  }

  async findByReserva(id_reserva: string): Promise<Historial_usuario[]> {
    try {
      return (await this.historialModel
        .find({ id_reserva })
        .sort({ fecha: -1 })
        .exec()
      ).map(doc => doc.toObject());
    } catch (err) {
      console.error('Error findByReserva:', err);
        throw new InternalServerErrorException('Error al buscar historial por reserva');
      }
    }
  async findOne(id: string): Promise<Historial_usuario> {
     const doc = await this.historialModel.findById(id);
     if (!doc) {
      throw new NotFoundException('Historial_usuario no encontrado');
    }
  return doc.toObject();
  }

  async update(id: string, dto: UpdateHistorial_usuarioDto): Promise<Historial_usuario> {
  try {
    const updateData: any = { ...dto };

    if (dto.fecha) updateData.fecha = new Date(dto.fecha);

    const historial = await this.historialModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!historial) {
      throw new NotFoundException('Historial_usuario no encontrado');
    }

    return historial.toObject();
  } catch (err) {
    console.error('Error updating:', err);
    throw new InternalServerErrorException('Error al actualizar historial_usuario');
  }
}

   async remove(id: string) {
      const deleted = await this.historialModel.findByIdAndDelete(id);
      if (!deleted) {
        throw new NotFoundException('Historial no encontrado');
      }
    return { deleted: true };
   }
}