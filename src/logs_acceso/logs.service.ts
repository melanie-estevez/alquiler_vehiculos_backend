import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Logs } from './schemas/logs.schema';
import { Contenido } from './schemas/contenido.schema';
import { CreateLogsDto } from './dto/create-logs.dto';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Logs.name) private readonly logsModel: Model<Logs>,
    @InjectModel(Contenido.name) private readonly contenidoModel: Model<Contenido>,
  ) {}

 async create(dto: CreateLogsDto): Promise<Logs>{
  console.log('DTO RECIBIDO:', dto);
    try {
      const logs = new this.logsModel({
        id_usuario: dto.id_usuario,
        accion: dto.accion,
        ip: dto.ip,
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
        logs.contenidos = contenidosIds;
      }
      return await logs.save();
    } catch (err) {
      console.error('Error creando log:', err);
      throw new InternalServerErrorException('Error al crear el log');
    }
  }

  async findAll(options: { page: number, limit: number }): Promise<{ items: Logs[]; page: number; limit: number }> {
    try {
      const { page, limit } = options;
      const logs = await this.logsModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('contenidos');

      return { items: logs, page, limit };
    } catch (err) {
      console.error('Error retrieving courses:', err);
      throw new InternalServerErrorException();
    }
  }

   async findOne(id: string): Promise<Logs> {
    const log = await this.logsModel.findById(id).populate('contenidos')
      if (!log) {
      throw new NotFoundException('Log no encontrado')
    }
    return log;
  }

  async update(id: string, dto: CreateLogsDto): Promise<Logs> {
    try {
     const logs = await this.logsModel.findById(id);
     if (!logs) throw new NotFoundException('Log no encontrado');
        const { contenidos, ...logsData} = dto;
      Object.assign(logs, logsData);

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
        logs.contenidos = contenidosIds;
      }
      return await logs.save();
    } catch (err) {
      console.error('Error updating course:', err);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const logs = await this.logsModel.findById(id);
      if (!logs) throw new NotFoundException();
      await logs.deleteOne();
    
    } catch (err) {
      console.error('Error deleting course:', err);
      throw new InternalServerErrorException();
    }
  }
}
