/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any, response: Response): Promise<{
        message: string;
        result: {
            user: {
                _id: string;
                name: string;
                email: string;
                role: string;
            };
            access_token: string;
        };
    }>;
    register(registerUserDto: RegisterUserDto): Promise<{
        message: string;
        result: {
            _id: import("mongoose").Types.ObjectId;
            createdAt: Date;
        };
    }>;
    getAccount(user: IUser): {
        message: string;
        result: IUser;
    };
    handleRefreshToken(req: Request, response: Response): Promise<{
        message: string;
        result: {
            user: {
                _id: import("mongoose").Types.ObjectId;
                name: string;
                email: string;
                role: string;
            };
            access_token: string;
        };
    }>;
    logout(response: Response, user: IUser): Promise<{
        message: string;
        result: string;
    }>;
}
