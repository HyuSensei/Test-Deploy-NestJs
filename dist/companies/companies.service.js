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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const company_schema_1 = require("./schemas/company.schema");
const mongoose_1 = require("@nestjs/mongoose");
let CompaniesService = class CompaniesService {
    constructor(companyModel) {
        this.companyModel = companyModel;
    }
    async create(createCompanyDto, user) {
        return await this.companyModel.create({
            ...createCompanyDto,
            createdBy: {
                _id: user._id,
                email: user.email
            }
        });
    }
    async findAll() {
        return await this.companyModel.find();
    }
    findOne(id) {
        return `This action returns a #${id} company`;
    }
    async update(id, updateCompanyDto, user) {
        return await this.companyModel.updateOne({ _id: id }, {
            ...updateCompanyDto,
            updatedBy: {
                _id: user._id,
                email: user.email
            }
        });
    }
    async remove(id, user) {
        const deleted = await this.companyModel.softDelete({
            _id: id
        });
        if (deleted.deleted === 1) {
            return await this.companyModel.updateOne({ _id: id }, {
                deletedBy: {
                    _id: user._id,
                    email: user.email
                }
            });
        }
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(company_schema_1.Company.name)),
    __metadata("design:paramtypes", [Object])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map