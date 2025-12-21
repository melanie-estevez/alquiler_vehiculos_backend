import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistorialService } from './historial.service';
import { Historial, HistorialReservasSchema } from './schemas/historial.schema';
import { HistorialController } from './historial.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
        {name: Historial.name, schema: HistorialReservasSchema},
    ]),
],
controllers: [HistorialController],
providers: [HistorialService],
})
export class HistorialModule {}