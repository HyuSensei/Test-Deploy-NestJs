"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
        this.getHashPassword = async (password) => {
            const saltOrRounds = 10;
            const hash = await bcrypt.hash(password, saltOrRounds);
            return hash;
        };
        this.checkUserPassword = async (password, hash) => {
            const isCheck = await bcrypt.compare(password, hash);
            return isCheck;
        };
        this.updateUserToken = async (token, _id) => {
            return await this.userModel.updateOne({
                _id: _id
            }, {
                refreshToken: token
            });
        };
        this.findUserByToken = async (refreshToken) => {
            return await this.userModel.findOne({ refreshToken });
        };
    }
    async create(createUserDto, userCreate) {
        const isExist = await this.userModel.findOne({
            email: userCreate.email
        });
        if (isExist) {
            throw new common_1.BadRequestException(`Email:${userCreate.email} đã tồn tại`);
        }
        const hashPassword = await this.getHashPassword(createUserDto.password);
        console.log(hashPassword);
        let user = await this.userModel.create({
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashPassword,
            age: createUserDto.age,
            gender: createUserDto.gender,
            address: createUserDto.address,
            role: createUserDto.role,
            company: createUserDto.company,
            createdBy: {
                _id: userCreate._id,
                email: userCreate.email
            }
        });
        return {
            message: "Tạo người dùng thành công",
            result: {
                _id: user._id,
                createdAt: user.createdAt
            }
        };
    }
    findAll() {
        return `This action returns all users`;
    }
    findOne(id) {
        return `This action returns a #${id} user`;
    }
    async findOneByUsername(username) {
        let user = await this.userModel.findOne({
            email: username
        });
        return user;
    }
    async update(id, updateUserDto, user) {
        const updateUser = await this.userModel.updateOne({
            _id: id
        }, {
            ...updateUserDto,
            updatedAt: {
                _id: user._id,
                email: user.email
            }
        });
        return {
            message: 'Update người dùng thành công',
            result: updateUser
        };
    }
    async remove(id, user) {
        await this.userModel.updateOne({
            _id: id
        }, {
            deletedBy: {
                _id: user._id,
                email: user.email
            }
        });
        const deletedUser = await this.userModel.softDelete({
            _id: id
        });
        return {
            message: "Delete người dùng thành công",
            result: deletedUser
        };
    }
    async registerUser(registerUserDto) {
        const isExist = await this.userModel.findOne({
            email: registerUserDto.email
        });
        if (isExist) {
            throw new common_1.BadRequestException(`Email:${registerUserDto.email} đăng ký đã tồn tại`);
        }
        const hashPassword = await this.getHashPassword(registerUserDto.password);
        let user = await this.userModel.create({
            name: registerUserDto.name,
            email: registerUserDto.email,
            password: hashPassword,
            age: registerUserDto.age,
            gender: registerUserDto.gender,
            address: registerUserDto.address
        });
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [Object])
], UsersService);
//# sourceMappingURL=users.service.js.map