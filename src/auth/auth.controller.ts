import { Controller, Post, Body, Get, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { loginDto } from "./dto/login.dto";
import { registerDto } from "./dto/register.dto";
import { AuthGuard } from "./auth.guard";

@Controller('auth')
export class AuthController{
    constructor ( private readonly authService: AuthService){}

    @Post('register')
    register(@Body() registerDto: registerDto){
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body() loginDto: loginDto){
        return this.authService.login(loginDto)
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async getUser(@Request() req) {
        // req.user contendrá la información del usuario autenticado
        const { email } = req.user;
        const user = await this.authService.findUserByEmail(email);
        return { user };
    }
}

