import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Logs {
  @Prop({ required: true })
  id_usuario: string;

  @Prop({ required: true })
  accion: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  fecha: Date;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Contenido' }],
    default: [],
  })
  contenidos: Types.ObjectId[];
}

export const LogsSchema = SchemaFactory.createForClass(Logs);
