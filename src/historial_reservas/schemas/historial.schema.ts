import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'historial_reservas' })
export class Historial extends Document {

  @Prop({ required: true })
  id_reserva: number;   

  @Prop()
  estado_anterior: string;

  @Prop()
  estado_nuevo: string;

  @Prop()
  fecha: Date;
}

export const HistorialReservasSchema =
  SchemaFactory.createForClass(Historial);