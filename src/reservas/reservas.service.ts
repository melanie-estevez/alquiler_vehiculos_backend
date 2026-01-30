import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Reservas } from './reservas.entity';
import { Vehiculo } from '../vehiculos/vehiculos.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { ClientesService } from 'src/clientes/clientes.service';
import { EstadoReserva } from './enums/estado-reserva.enum';
import { EstadoVehiculo } from '../vehiculos/enums/estado-vehiculo.enum';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reservas)
    private readonly reservasRepository: Repository<Reservas>,
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    private readonly clientesService: ClientesService,
  ) {}

  private handleDbError(error: any, msg: string): never {
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }
    throw new InternalServerErrorException(msg);
  }

  private calcTotal(vehiculo: Vehiculo, dias: number) {
    const p = Number(vehiculo.precio_diario || 0);
    const d = Number(dias || 0);
    if (!d || d <= 0) throw new BadRequestException('Días inválidos');
    if (!p || p <= 0) throw new BadRequestException('El vehículo no tiene precio diario configurado');
    return Number((d * p).toFixed(2));
  }

  async createForUser(userId: string, dto: CreateReservaDto): Promise<Reservas> {
    try {
      const { id_vehiculo, ...data } = dto;

      const cliente = await this.clientesService.getMe(userId);

      const vehiculo = await this.vehiculoRepository.findOne({
        where: { id_vehiculo },
      });

      if (!vehiculo) {
        throw new NotFoundException(`Vehículo ${id_vehiculo} no existe`);
      }

      if (vehiculo.estado !== EstadoVehiculo.DISPONIBLE) {
        throw new BadRequestException('El vehículo no está disponible');
      }

      const total = this.calcTotal(vehiculo, (data as any).dias);

      const reserva = this.reservasRepository.create({
        ...data,
        vehiculo,
        cliente,
        total,
        estado: EstadoReserva.PENDIENTE,
      });

      return await this.reservasRepository.save(reserva);
    } catch (error) {
      throw this.handleDbError(error, 'Error al crear reserva');
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Reservas>> {
    try {
      const { page, limit, search } = queryDto;

      const query = this.reservasRepository
        .createQueryBuilder('reserva')
        .leftJoinAndSelect('reserva.vehiculo', 'vehiculo')
        .leftJoinAndSelect('reserva.cliente', 'cliente');

      if (search) {
        query.andWhere(`vehiculo.placa ILIKE :search`, {
          search: `%${search}%`,
        });
      }

      return await paginate<Reservas>(query, { page, limit });
    } catch (error) {
      throw this.handleDbError(error, 'Error al listar reservas');
    }
  }

  async findMine(userId: string, queryDto: QueryDto): Promise<Pagination<Reservas>> {
    try {
      const { page, limit } = queryDto;

      const query = this.reservasRepository
        .createQueryBuilder('reserva')
        .leftJoinAndSelect('reserva.vehiculo', 'vehiculo')
        .leftJoinAndSelect('reserva.cliente', 'cliente')
        .leftJoinAndSelect('cliente.user', 'user')
        .where('user.id = :userId', { userId })
        .orderBy('reserva.fecha_inicio', 'DESC');

      return await paginate<Reservas>(query, { page, limit });
    } catch (error) {
      throw this.handleDbError(error, 'Error al listar reservas del usuario');
    }
  }

  async findOne(id: string): Promise<Reservas> {
    try {
      const reserva = await this.reservasRepository.findOne({
        where: { id_reserva: id },
        relations: ['vehiculo', 'cliente'],
      });

      if (!reserva) {
        throw new NotFoundException(`Reserva ${id} no existe`);
      }

      return reserva;
    } catch (error) {
      throw this.handleDbError(error, 'Error al obtener reserva');
    }
  }

  async update(id: string, dto: UpdateReservaDto): Promise<Reservas> {
    try {
      const reserva = await this.findOne(id);
      const { id_vehiculo, ...data } = dto;

      Object.assign(reserva, data);

      if (id_vehiculo !== undefined) {
        const vehiculo = await this.vehiculoRepository.findOne({
          where: { id_vehiculo },
        });

        if (!vehiculo) {
          throw new NotFoundException(`Vehículo ${id_vehiculo} no existe`);
        }

        reserva.vehiculo = vehiculo;
      }

      if ((data as any).dias !== undefined) {
        reserva.total = this.calcTotal(reserva.vehiculo, (reserva as any).dias);
      }

      return await this.reservasRepository.save(reserva);
    } catch (error) {
      throw this.handleDbError(error, 'Error al actualizar reserva');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const reserva = await this.findOne(id);
      await this.reservasRepository.remove(reserva);
    } catch (error) {
      throw this.handleDbError(error, 'Error al eliminar reserva');
    }
  }
}
