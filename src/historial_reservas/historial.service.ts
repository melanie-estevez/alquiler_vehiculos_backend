import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Historial } from './schemas/historial.schema';
import { Contenido } from './schemas/contenido.schema';
import { CreateHistorialDto } from './dto/create-historial.dto';

@Injectable()
export class HistorialService {
  constructor(
    @InjectModel(Historial.name) private readonly historialModel: Model<Historial>,
    @InjectModel(Contenido.name) private readonly contenidoModel: Model<Contenido>,
  ) {}

 async create(dto: CreateHistorialDto): Promise<Historial>{
  console.log('DTO RECIBIDO:', dto);
    try {
      const historial = new this.historialModel({
        id_reserva: dto.id_reserva,
        estado_anterior: dto.estado_anterior,
        estado_nuevo: dto.estado_nuevo,
        fecha: dto.fecha,
      });

      if (dto.contenidos && dto.contenidos.length > 0) {
        const contenidosIds: Types.ObjectId[] = [];
        for (const contenido of dto.contenidos) {
          const contenidoEntity = await this.contenidoModel.create({
            titulo: contenido.titulo,
            duracion: contenido.duracion,
            descripcion: contenido.descripcion,
            tipo: contenido.tipo,
            enlace: contenido.enlace,
            dificultad: contenido.dificultad,
            fecha_publicacion: contenido.fecha_publicacion,
            completado: contenido.completado,
            tiempo_estimado: contenido.tiempo_estimado,
            video_id: contenido.video_id,
          });

            contenidosIds.push(contenidoEntity._id); 
        }
        historial.contenidos = contenidosIds;
      }
      return await historial.save();
    } catch (err) {
      console.error('Error creando historial:', err);
      throw new InternalServerErrorException('Error al crear el historial');
    }
  }

  async findAll(options: { page: number, limit: number }): Promise<{ items: Historial[]; page: number; limit: number }> {
    try {
      const { page, limit } = options;
      const logs = await this.historialModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('contenidos');

      return { items: logs, page, limit };
    } catch (err) {
      console.error('Error retrieving courses:', err);
      throw new InternalServerErrorException();
    }
  }

   async findOne(id: string): Promise<Historial> {
    const log = await this.historialModel.findById(id).populate('contenidos')
      if (!log) {
      throw new NotFoundException('Historial no encontrado')
    }
    return log;
  }

  async update(id: string, dto: CreateHistorialDto): Promise<Historial> {
    try {
     const historial = await this.historialModel.findById(id);
     if (!historial) throw new NotFoundException('Historial no encontrado');
        const { contenidos, ...logsData} = dto;
      Object.assign(historial, logsData);

      if (contenidos) {
        const contenidosIds: Types.ObjectId[] = [];
        for (const contenido of contenidos) {
          const contenidoData = {
            titulo: contenido.titulo,
            duracion: contenido.duracion,
            descripcion: contenido.descripcion,
            tipo: contenido.tipo,
            enlace: contenido.enlace,
            dificultad: contenido.dificultad,
            fecha_publicacion: contenido.fecha_publicacion,
            completado: contenido.completado,
            tiempo_estimado: contenido.tiempo_estimado,
            video_id: contenido.video_id,
          };

          const contenidoEntity = await this.contenidoModel.create(contenido);
          contenidosIds.push(contenidoEntity._id);
        }
        historial.contenidos = contenidosIds;
      }
      return await historial.save();
    } catch (err) {
      console.error('Error updating course:', err);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const historial = await this.historialModel.findById(id);
      if (!historial) throw new NotFoundException();
      await historial.deleteOne();
    
    } catch (err) {
      console.error('Error deleting course:', err);
      throw new InternalServerErrorException();
    }
  }
}
