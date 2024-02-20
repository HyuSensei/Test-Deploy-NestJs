"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const ms_1 = __importDefault(require("ms"));
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.createRefeshToken = (payload) => {
            const refresh_token = this.jwtService.sign(payload, {
                secret: this.configService.get("JWT_REFRESH_SECRET"),
                expiresIn: this.configService.get("REFRESH_EXPIRES")
            });
            return refresh_token;
        };
        this.processNewToken = async (refresh_token, response) => {
            try {
                let user = await this.usersService.findUserByToken(refresh_token);
                if (user) {
                    const payload = {
                        sub: "token-refresh",
                        iss: "From Server",
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    };
                    const refresh_token = this.createRefeshToken(payload);
                    await this.usersService.updateUserToken(refresh_token, user._id.toString());
                    response.cookie('refresh_token', refresh_token, {
                        httpOnly: true,
                        maxAge: (0, ms_1.default)(this.configService.get("REFRESH_EXPIRES"))
                    });
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
                }
                else {
                    throw new common_1.BadRequestException('RefreshToken không hợp lên');
                }
            }
            catch (error) {
                throw new common_1.BadRequestException('RefreshToken không hợp lên');
            }
        };
        this.logoutUser = async (response, user) => {
            await this.usersService.updateUserToken("", user._id);
            response.clearCookie('refresh_token');
            return {
                message: 'Logout user',
                result: "ok"
            };
        };
    }
    async validateUser(username, pass) {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const checkPassword = await this.usersService.checkUserPassword(pass, user.password);
            if (checkPassword == true) {
                return user;
            }
        }
        return null;
    }
    async login(user, response) {
        const payload = {
            sub: "token-login",
            iss: "From Server",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        const refresh_token = this.createRefeshToken(payload);
        await this.usersService.updateUserToken(refresh_token, user._id);
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: (0, ms_1.default)(this.configService.get("REFRESH_EXPIRES"))
        });
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
    async register(registerUserDto) {
        let user = await this.usersService.registerUser(registerUserDto);
        return {
            message: 'Đăng ký thành công',
            result: {
                _id: user._id,
                createdAt: user.createdAt
            }
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map