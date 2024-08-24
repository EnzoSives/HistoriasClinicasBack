import { Controller, Post, Body, Get, Request, UseGuards, InternalServerErrorException, NotFoundException, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { loginDto } from "./dto/login.dto";
import { registerDto } from "./dto/register.dto";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() registerDto: registerDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body() loginDto: loginDto) {
        return this.authService.login(loginDto)
    }

    @Get('user')
    async getUser(@Query('email') email: string) {
        try {
            const decodedEmail = decodeURIComponent(email); // Decodifica el email
            const user = await this.authService.findUserByEmail(decodedEmail);

            if (user) {
                return { user };
            } else {
                throw new NotFoundException('Usuario no encontrado');
            }
        } catch (error) {
            console.error('Error al encontrar el usuario:', error);
            throw new InternalServerErrorException('Error interno del servidor');
        }
    }
}

