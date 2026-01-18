import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Despliegue Backend Alquiler Vehiculos!';
  }
}
