import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Historial_usuarioService } from './historial_usuario.service';
import { Historial_usuario, Historial_usuarioSchema } from './schemas/historial_usuario.schema';
import { Historial_usuarioController } from './historial_usuario.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
        {name: Historial_usuario.name, schema: Historial_usuarioSchema},
    ]),
],
controllers: [Historial_usuarioController],
providers: [Historial_usuarioService],
})
export class Historial_usuarioModule {}