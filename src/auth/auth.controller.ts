import { Controller, Post, UseGuards, Get, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, User } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    // @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return await this.authService.register(registerUserDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get('account')
    getAccount(@User() user: IUser) {
        return {
            message: 'Get accounnt User',
            result: user
        }
    }

    @Get('refresh')
    handleRefreshToken(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
        const refresh_token = req.cookies["refresh_token"]
        return this.authService.processNewToken(refresh_token, response)
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@Res({ passthrough: true }) response: Response, @User() user: IUser) {
        return this.authService.logoutUser(response, user)
    }
}
