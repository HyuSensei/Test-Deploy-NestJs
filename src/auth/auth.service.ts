import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const checkPassword = await this.usersService.checkUserPassword(pass, user.password)
            if (checkPassword == true) {
                return user
            }
        }
        return null;
    }

    async login(user: IUser, response: Response) {
        const payload = {
            sub: "token-login",
            iss: "From Server",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        const refresh_token = this.createRefeshToken(payload)
        await this.usersService.updateUserToken(refresh_token, user._id)
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: ms(this.configService.get<string>("REFRESH_EXPIRES"),
            )
        })
        return {
            message: 'Login user',
            result: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                access_token: this.jwtService.sign(payload),
            }
        };
    }

    createRefeshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
            expiresIn: this.configService.get<string>("REFRESH_EXPIRES")
        })
        return refresh_token
    }

    async register(registerUserDto: RegisterUserDto) {
        let user = await this.usersService.registerUser(registerUserDto)
        return {
            message: 'Đăng ký thành công',
            result: {
                _id: user._id,
                createdAt: user.createdAt
            }
        }
    }

    processNewToken = async (refresh_token: string, response: Response) => {
        try {
            let user = await this.usersService.findUserByToken(refresh_token)
            if (user) {
                const payload = {
                    sub: "token-refresh",
                    iss: "From Server",
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
                const refresh_token = this.createRefeshToken(payload)
                await this.usersService.updateUserToken(refresh_token, user._id.toString())
                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>("REFRESH_EXPIRES"))
                })
                return {
                    message: 'Get User by refresh token',
                    result: {
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        },
                        access_token: this.jwtService.sign(payload),
                    }
                };
            } else {
                throw new BadRequestException('RefreshToken không hợp lên')
            }
        } catch (error) {
            throw new BadRequestException('RefreshToken không hợp lên')
        }
    }

    logoutUser = async (response: Response, user: IUser) => {
        await this.usersService.updateUserToken("", user._id)
        response.clearCookie('refresh_token')
        return {
            message: 'Logout user',
            result: "ok"
        }
    }
}
