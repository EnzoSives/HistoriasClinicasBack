// src/auth/auth.service.ts (ACTUALIZADO)
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../common/enum/rol.enum';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Medico } from 'src/medico/entities/medico.entity';

export interface RegisterMedicoDto {
  // Datos de usuario
  username: string;
  email: string;
  password: string;
  // Datos de médico
  nombre: string;
  apellido: string;
  dni: string;
  especialidad: string;
  matricula: string;
  telefono?: string;
  colegioMedico?: string;
}

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
    // Verificar si ya existe usuario con ese username o email
    const usuarioExistente = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: registerDto.username })
      .orWhere('user.email = :email', { email: registerDto.email })
      .getOne();

    if (usuarioExistente) {
      throw new ConflictException(
        'Ya existe un usuario con ese username o email',
      );
    }

    // Verificar si ya existe médico con ese DNI o matrícula
    const medicoExistente = await this.medicoRepository.findOne({
      where: [{ dni: registerDto.dni }, { matricula: registerDto.matricula }],
    });

    const medicoPorDni = await this.medicoRepository.findOne({
      where: { dni: registerDto.dni },
    });

    const medicoPorMatricula = await this.medicoRepository.findOne({
      where: { matricula: registerDto.matricula },
    });

    if (medicoPorDni || medicoPorMatricula) {
      throw new ConflictException(
        'Ya existe un médico con ese DNI o matrícula',
      );
    }

    // Hashear contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Crear usuario
    const nuevoUser = new User();
    nuevoUser.username = registerDto.username;
    nuevoUser.password = hashedPassword;
    nuevoUser.email = registerDto.email;
    nuevoUser.role = Role.MEDICO;

    const userGuardado = await this.userRepository.save(nuevoUser);

    // Crear médico asociado
    const nuevoMedico = new Medico();
    nuevoMedico.nombre = registerDto.nombre;
    nuevoMedico.apellido = registerDto.apellido;
    nuevoMedico.dni = registerDto.dni;
    nuevoMedico.especialidad = registerDto.especialidad;
    nuevoMedico.matricula = registerDto.matricula;
    nuevoMedico.telefono = registerDto.telefono;
    nuevoMedico.colegioMedico = registerDto.colegioMedico;

    nuevoMedico.user_id = userGuardado.id;
    await this.medicoRepository.save(nuevoMedico);

    // Auto-login después del registro
    return this.login(registerDto.username, registerDto.password);
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: [
        { username },
        { email: username }, // Permitir login con email o username
      ],
      relations: ['medico'],
    });

    if (!user || !user.isActive) {
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
        medico: user.medico
          ? {
              id_medico: user.medico.id_medico,
              nombreCompleto: user.medico.nombreCompleto,
              especialidad: user.medico.especialidad,
              matricula: user.medico.matricula,
            }
          : null,
      },
    };
  }

  async obtenerPerfilCompleto(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
      relations: ['medico', 'medico.pacientes'],
    });

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

    Object.assign(user, datosUser);
    await this.userRepository.save(user);

    // Actualizar datos de médico si existen
    if (datosMedico && user.medico) {
      Object.assign(user.medico, datosMedico);
      await this.medicoRepository.save(user.medico);
    }

    return this.obtenerPerfilCompleto(userId);
  }
}
