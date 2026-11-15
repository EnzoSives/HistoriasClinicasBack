// src/auth/auth.controller.ts (ACTUALIZADO)
import { Controller, Post, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService, RegisterMedicoDto } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterMedicoDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: { username: string; password: string }) {
        return this.authService.login(loginDto.username, loginDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        return this.authService.obtenerPerfilPublico(req.user.id);
    }

    @UseGuards(AuthGuard)
    @Put('profile')
    async updateProfile(
        @Request() req: any,
        @Body() updateDto: UpdateProfileDto
    ) {
        return this.authService.actualizarPerfil(req.user.id, updateDto.medico);
    }
}
