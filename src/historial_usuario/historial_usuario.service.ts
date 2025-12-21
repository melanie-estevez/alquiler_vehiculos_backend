import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { Historial_usuario } from './schemas/historial_usuario.schema';
import { CreateHistorial_usuarioDto } from './dto/create-historial_usuario.dto';
import { UpdateHistorial_usuarioDto } from './dto/update-historial_usuario.dto';
@Injectable()
export class Historial_usuarioService {
  historial_usuarioRepository: any;
  constructor(
    @InjectModel(Historial_usuario.name) private readonly historial_usuarioModel: Model<Historial_usuario>,
  ) {}

 async create(dto: CreateHistorial_usuarioDto): Promise<Historial_usuario>{
  console.log('DTO RECIBIDO:', dto);
    try {
      const historial_usuario = new this.historial_usuarioModel({
        id_reserva: dto.id_reserva,
        id_usuario: dto.id_usuario,
        accion: dto.accion,
        fecha: dto.fecha,
      });
      return await historial_usuario.save();
    } catch (err) {
      console.error('Error creando historial_usuario:', err);
      throw new InternalServerErrorException('Error al crear el historial_usuario');
    }
  }

async findAll(options: {page: number;limit: number;search?: string;searchField?: 'id_usuario' | 'accion';}): 
Promise<{ items: Historial_usuario[]; page: number; limit: number }> {
  try {
    const {page, limit, search, searchField } = options;
    const filter: any = {};
    if (search) {
      if (searchField) {
        filter[searchField] = { $regex: search, $options: 'i' };
      } else {
        filter.$or = [
          { id_usuario: { $regex: search, $options: 'i' } },
          { accion: { $regex: search, $options: 'i' } },
        ];
      }
    }
    const items = await this.historial_usuarioModel
      .find(filter)
      .skip((page - 1) * limit)
      .populate('id_reserva') 
      .limit(limit);
    return { items, page, limit };
  } catch (err) {
    console.error('Error retrieving historial_usuario:', err);
    throw new InternalServerErrorException();
  }
}
   async findOne(id: string): Promise<Historial_usuario> {
    const historial_usuario = await this.historial_usuarioModel.findById(id)
      if (!historial_usuario) {
      throw new NotFoundException('Historial_usuario no encontrado')
    }
    return historial_usuario;
  }

  async update(id: string, dto: UpdateHistorial_usuarioDto): Promise<Historial_usuario> {
    try {
     const historial_usuario = await this.historial_usuarioModel.findById(id);
     if (!historial_usuario) {
      throw new NotFoundException('Historial_usuario no encontrado')};
        const {...historial_usuarioData} = dto;
      Object.assign(historial_usuario, historial_usuarioData);
      return await historial_usuario.save();
    } catch (err) {
      console.error('Error updating course:', err);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const historial_usuario = await this.historial_usuarioModel.findById(id);
      if (!historial_usuario) throw new NotFoundException();
      await historial_usuario.deleteOne();
    
    } catch (err) {
      console.error('Error deleting course:', err);
      throw new InternalServerErrorException();
    }
  }
}
