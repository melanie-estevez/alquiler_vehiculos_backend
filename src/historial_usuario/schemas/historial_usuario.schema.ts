import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'historial_usuario', timestamps: true })
export class Historial_usuario extends Document {
  @Prop({ required: true })
  id_usuario: string;

  @Prop({ required: true })
  id_reserva: string;

  @Prop({ required: true })
  accion: string;

  @Prop({ required: true })
  fecha: Date;
}

export const Historial_usuarioSchema = SchemaFactory.createForClass(Historial_usuario);