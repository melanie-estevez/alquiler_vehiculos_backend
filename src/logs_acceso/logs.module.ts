import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsService } from './logs.service';
import { Logs, LogsSchema } from './schemas/logs.schema';
import { Contenido, ContenidoSchema } from './schemas/contenido.schema';
import { LogsController } from './logs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
        {name: Logs.name, schema: LogsSchema},
        {name: Contenido.name, schema: ContenidoSchema},
    ]),
],
controllers: [LogsController],
providers: [LogsService],
})
export class LogsModule {}