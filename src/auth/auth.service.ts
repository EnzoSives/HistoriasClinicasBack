// src/auth/auth.service.ts (CORREGIDO)
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../common/enum/rol.enum';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Medico } from 'src/medico/entities/medico.entity';
import { RegisterMedicoDto } from './dto/register.dto';
 // Importar el DTO

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Medico)
    private medicoRepository: Repository<Medico>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterMedicoDto) {
    // Validar datos de entrada
    if (!registerDto.username?.trim() || !registerDto.email?.trim()) {
      throw new BadRequestException('Username y email son requeridos');
    }

    if (!registerDto.dni?.trim() || !registerDto.matricula?.trim()) {
      throw new BadRequestException('DNI y matrícula son requeridos');
    }

    // Verificar si ya existe usuario con ese username o email
    const usuarioExistente = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: registerDto.username.trim() })
      .orWhere('user.email = :email', { email: registerDto.email.trim() })
      .getOne();

    if (usuarioExistente) {
      throw new ConflictException(
        'Ya existe un usuario con ese username o email',
      );
    }

    // Verificar si ya existe médico con ese DNI o matrícula (UNA SOLA CONSULTA)
    const medicoExistente = await this.medicoRepository
      .createQueryBuilder('medico')
      .where('medico.dni = :dni', { dni: registerDto.dni.trim() })
      .orWhere('medico.matricula = :matricula', { matricula: registerDto.matricula.trim() })
      .getOne();

    if (medicoExistente) {
      throw new ConflictException(
        'Ya existe un médico con ese DNI o matrícula',
      );
    }

    // Hashear contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Crear usuario
    const nuevoUser = new User();
    nuevoUser.username = registerDto.username.trim();
    nuevoUser.password = hashedPassword;
    nuevoUser.email = registerDto.email.trim();
    nuevoUser.role = registerDto.role ?? Role.MEDICO;

    const userGuardado = await this.userRepository.save(nuevoUser);

    // Crear médico asociado
    const nuevoMedico = new Medico();
    nuevoMedico.nombre = registerDto.nombre.trim();
    nuevoMedico.apellido = registerDto.apellido.trim();
    nuevoMedico.dni = registerDto.dni.trim();
    nuevoMedico.especialidad = registerDto.especialidad.trim();
    nuevoMedico.matricula = registerDto.matricula.trim();
    nuevoMedico.telefono = registerDto.telefono?.trim();
    nuevoMedico.colegioMedico = registerDto.colegioMedico?.trim();

    nuevoMedico.user_id = userGuardado.id;
    await this.medicoRepository.save(nuevoMedico);

    // Auto-login después del registro
    return this.login(registerDto.username, registerDto.password);
  }

  async login(username: string, password: string) {
    // Validar parámetros de entrada
    if (!username?.trim() || !password) {
      throw new UnauthorizedException('Username y password son requeridos');
    }

    const usernameClean = username.trim();

    // Usar QueryBuilder para mayor control sobre la consulta
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.medico', 'medico')
      .where('(user.username = :username OR user.email = :email)', {
        username: usernameClean,
        email: usernameClean,
      })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar último login
    user.updateLastLogin();
    await this.userRepository.save(user);

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      id_medico: user.medico?.id_medico,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      // --- CAMBIO AQUÍ ---
      // Simplemente pasa el objeto medico completo que ya fue cargado
      medico: user.medico ? user.medico : null,
      // --- FIN DEL CAMBIO ---
  },
    };
  }

  async obtenerPerfilCompleto(userId: number): Promise<User> {
    // Validar userId
    if (!userId || userId <= 0) {
      throw new BadRequestException('ID de usuario inválido');
    }

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.medico', 'medico')
      .leftJoinAndSelect('medico.pacientes', 'pacientes')
      .where('user.id = :id', { id: userId })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }

  async actualizarPerfil(
    userId: number,
    datosUser: Partial<User>,
    datosMedico?: Partial<Medico>,
  ) {
    const user = await this.obtenerPerfilCompleto(userId);

    // Actualizar datos de usuario
    if (datosUser.password) {
      const saltRounds = 10;
      datosUser.password = await bcrypt.hash(datosUser.password, saltRounds);
    }

    // Limpiar strings si existen
    if (datosUser.username) {
      datosUser.username = datosUser.username.trim();
    }
    if (datosUser.email) {
      datosUser.email = datosUser.email.trim();
    }

    Object.assign(user, datosUser);
    await this.userRepository.save(user);

    // Actualizar datos de médico si existen
    if (datosMedico && user.medico) {
      // Limpiar strings en datos del médico
      Object.keys(datosMedico).forEach(key => {
        if (typeof datosMedico[key] === 'string') {
          datosMedico[key] = datosMedico[key].trim();
        }
      });

      Object.assign(user.medico, datosMedico);
      await this.medicoRepository.save(user.medico);
    }

    return this.obtenerPerfilCompleto(userId);
  }
}

export { RegisterMedicoDto };
