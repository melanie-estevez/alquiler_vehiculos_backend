import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientesModule } from './clientes/clientes.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { VehiculosModule } from './vehiculos/vehiculos.module';
import { ReservasModule } from './reservas/reservas.module';
import { MantenimientosModule}from './mantenimientos/mantenimientos.module';
import { LogsModule } from './logs_acceso/logs.module';
import { HistorialModule } from './historial_reservas/historial.module';
import { AlquilerModule } from './alquileres/alquiler.module';
import { PagosModule } from './pagos/pagos.module';
import { FacturasModule } from './facturas/facturas.module';
import { DetallesFacturaModule } from './detalle_factura/detalle_factura.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { MailController } from './mail/mail.controller';




@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      synchronize: true,
      // ssl: { rejectUnauthorized: false }, 
    }), 
    AuthModule, UsersModule, SucursalesModule, VehiculosModule, ReservasModule, MantenimientosModule, LogsModule, HistorialModule, PagosModule, AlquilerModule, ClientesModule, FacturasModule, DetallesFacturaModule, MailModule
  ],
  controllers: [AppController, MailController],
  providers: [AppService, MailService],
})
export class AppModule {}
