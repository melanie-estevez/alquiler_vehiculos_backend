import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'historial_reservas', timestamps: true })
export class Historial_usuario extends Document {

  @Prop({ required: true })
  id_reserva: string; 

  @Prop({ required: true })
  estado_anterior: string;

  @Prop({ required: true })
  estado_nuevo: string;

  @Prop({ required: true })
  fecha: Date;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Contenido' }],
    default: [],
  })
  contenidos: Types.ObjectId[];
}

export const Historial_usuarioSchema = SchemaFactory.createForClass(Historial_usuario);