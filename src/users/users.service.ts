import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

  getHashPassword = async (password: string) => {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash
  }

  checkUserPassword = async (password: string, hash: string) => {
    const isCheck = await bcrypt.compare(password, hash);
    return isCheck
  }

  async create(createUserDto: CreateUserDto, userCreate: IUser) {
    const isExist = await this.userModel.findOne({
      email: userCreate.email
    })
    if (isExist) {
      throw new BadRequestException(`Email:${userCreate.email} đã tồn tại`)
    }
    const hashPassword = await this.getHashPassword(createUserDto.password)
    console.log(hashPassword)
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
    })
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

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  async findOneByUsername(username: string) {
    let user = await this.userModel.findOne({
      email: username
    })
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    const updateUser = await this.userModel.updateOne({
      _id: id
    }, {
      ...updateUserDto,
      updatedAt: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      message: 'Update người dùng thành công',
      result: updateUser
    }
  }

  async remove(id: string, user: IUser) {
    await this.userModel.updateOne({
      _id: id
    }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    const deletedUser = await this.userModel.softDelete({
      _id: id
    });
    return {
      message: "Delete người dùng thành công",
      result: deletedUser
    }
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const isExist = await this.userModel.findOne({
      email: registerUserDto.email
    })
    if (isExist) {
      throw new BadRequestException(`Email:${registerUserDto.email} đăng ký đã tồn tại`)
    }
    const hashPassword = await this.getHashPassword(registerUserDto.password)
    let user = await this.userModel.create({
      name: registerUserDto.name,
      email: registerUserDto.email,
      password: hashPassword,
      age: registerUserDto.age,
      gender: registerUserDto.gender,
      address: registerUserDto.address
    })
    return user;
  }

  updateUserToken = async (token: string, _id: string) => {
    return await this.userModel.updateOne({
      _id: _id
    }, {
      refreshToken: token
    })
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken })
  }
}
