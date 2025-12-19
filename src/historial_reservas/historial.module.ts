import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistorialService } from './historial.service';
import { Historial, HistorialSchema } from './schemas/historial.schema';
import { Contenido, ContenidoSchema } from './schemas/contenido.schema';
import { HistorialController } from './historial.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
        {name: Historial.name, schema: HistorialSchema},
        {name: Contenido.name, schema: ContenidoSchema},
    ]),
],
controllers: [HistorialController],
providers: [HistorialService],
})
export class HistorialModule {}