import {Controller,Post,Body,Get,Req,UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return new SuccessResponseDto('Login exitoso', result);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return new SuccessResponseDto('Usuario registrado correctamente', user);
  }

  @Post('bootstrap-admin')
  async bootstrapAdmin() {
    const result = await this.usersService.createFirstAdminIfNone(
      'admin@admin.com',
      'admin12345',
    );
    return new SuccessResponseDto('Proceso de bootstrap ejecutado', result);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return new SuccessResponseDto('Usuario autenticado', req.user);
  }
}
