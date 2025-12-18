import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Historial{
    
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
export const HistorialSchema = SchemaFactory.createForClass(Historial);

