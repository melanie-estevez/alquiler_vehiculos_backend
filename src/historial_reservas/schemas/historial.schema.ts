import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'historial_reservas', timestamps: true })
export class Historial extends Document {

  @Prop({ required: true })
  id_reserva: number; // viene de Postgres (INT)

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

export const HistorialSchema = SchemaFactory.createForClass(Historial);
