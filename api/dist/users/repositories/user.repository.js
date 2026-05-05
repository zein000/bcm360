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
var UserRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const user_search_field_enum_1 = require("../../enums/user-search-field.enum");
const errors_enum_1 = require("../../enums/errors.enum");
const company_model_1 = require("../../company/models/company.model");
const role_model_1 = require("../../roles/models/role.model");
const permission_model_1 = require("../../permissions/models/permission.model");
const token_model_1 = require("../../tokens/models/token.model");
const token_purpose_enum_1 = require("../../tokens/enums/token-purpose.enum");
const user_model_1 = require("../models/user.model");
let UserRepository = UserRepository_1 = class UserRepository {
    constructor(model, roleModel) {
        this.model = model;
        this.roleModel = roleModel;
        this.logger = new common_1.Logger(UserRepository_1.name);
        this.eagerLoadToken = {
            model: token_model_1.default,
            where: { purpose: token_purpose_enum_1.ETokenPurpose.INVITATION },
            order: [["createdAt", "DESC"]],
            limit: 1,
            required: false,
        };
    }
    async findOneByEmail(email, includeDeleted = false) {
        try {
            return await this.model.findOne({
                where: { email },
                paranoid: !includeDeleted,
                include: [company_model_1.default, this.eagerLoadToken],
            });
        }
        catch (error) {
            this.logger.error(error, `Failed to find user by email ${email}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findAllAndCount(limit, skip, fieldName, value, companyId, filters, sortBy, sortOrder) {
        try {
            let where = {};
            let include = [];
            let order = [];
            if (fieldName && value) {
                switch (fieldName) {
                    case user_search_field_enum_1.UserSearchField.NAME:
                        where = sequelize_2.Sequelize.literal(this.buildMatchQuery(value));
                        break;
                    case user_search_field_enum_1.UserSearchField.EMAIL:
                        where[fieldName] = { [sequelize_2.Op.like]: `%${value}%` };
                        break;
                }
            }
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    switch (key) {
                        case user_search_field_enum_1.UserSearchField.NAME:
                            if (!Array.isArray(value)) {
                                where = sequelize_2.Sequelize.literal(this.buildMatchQuery(value));
                            }
                            break;
                        case user_search_field_enum_1.UserSearchField.ROLE:
                            if (value) {
                                include.push({
                                    model: role_model_1.default,
                                    where: { code: value },
                                    attributes: [],
                                });
                            }
                            break;
                        default:
                            if (key in user_model_1.default.getAttributes()) {
                                where[key] = Array.isArray(value)
                                    ? { [sequelize_2.Op.in]: value }
                                    : { [sequelize_2.Op.like]: `%${value}%` };
                            }
                    }
                });
            }
            if (sortBy && sortOrder) {
                if (sortBy in user_model_1.default.getAttributes()) {
                    order.push([sortBy, sortOrder]);
                }
                else if (sortBy === "name") {
                    order.push([sequelize_2.Sequelize.literal("CONCAT(firstName, ' ', lastName)"), sortOrder]);
                }
            }
            else {
                order.push(["lastName", "ASC"]);
            }
            const { rows, count } = await this.model.findAndCountAll({
                where: { [sequelize_2.Op.and]: [where, companyId ? { companyId } : {}] },
                include,
                limit,
                offset: skip,
                order,
            });
            const data = await this.model.findAll({
                where: { id: { [sequelize_2.Op.in]: rows.map((r) => r.id) } },
                include: [company_model_1.default, { model: role_model_1.default, include: [permission_model_1.default] }, this.eagerLoadToken],
                order,
            });
            return { rows: data, count };
        }
        catch (error) {
            this.logger.error(error, "Failed to find users");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findById(id) {
        try {
            return await this.model.findOne({
                where: { id },
                include: [company_model_1.default, { model: role_model_1.default, include: [permission_model_1.default] }, this.eagerLoadToken],
            });
        }
        catch (error) {
            this.logger.error(error, `Failed to find user by ID ${id}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async updateRoleById(user, id) {
        try {
            const role = await this.roleModel.findAll({ where: { id: { [sequelize_2.Op.in]: id } } });
            await user.$set("role", role);
        }
        catch (error) {
            this.logger.error(error, `Failed to update role by ID ${id}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findOneByEmailWithCompany(email) {
        try {
            return await this.model.findOne({
                where: { email },
                include: [company_model_1.default, { model: role_model_1.default, include: [permission_model_1.default] }, this.eagerLoadToken],
            });
        }
        catch (error) {
            this.logger.error(error, `Failed to find user by email ${email}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findOneByEmailWithCompanyAndPermissions(email) {
        try {
            return await this.model.findOne({
                where: { email },
                include: [company_model_1.default, { model: role_model_1.default, include: [permission_model_1.default] }, this.eagerLoadToken],
            });
        }
        catch (error) {
            this.logger.error(error, `Failed to find user by email ${email}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findOneByIdWithCompanyAndPermissions(id) {
        try {
            return await this.model.findOne({
                where: { id },
                include: [company_model_1.default, { model: role_model_1.default, include: [permission_model_1.default] }, this.eagerLoadToken],
            });
        }
        catch (error) {
            this.logger.error(error, `Failed to find user by ID ${id}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async findOneByApiKeyWithCompanyAndPermissions(apiKey) {
        if (!apiKey)
            throw new common_1.BadRequestException("API key is required");
        try {
            return await this.model.findOne({
                where: { apiKey },
                include: [company_model_1.default, { model: role_model_1.default, include: [permission_model_1.default] }, this.eagerLoadToken],
            });
        }
        catch (error) {
            this.logger.error(error, `Failed to find user by apiKey ${apiKey}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async save(user) {
        try {
            return await user.save();
        }
        catch (error) {
            this.logger.error(error, `Failed to save user ${user.id}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async update(user, data) {
        try {
            return await user.update(data);
        }
        catch (error) {
            this.logger.error(error, `Failed to update user ${user.id}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async updateById(id, data) {
        try {
            return await this.model.update(data, { where: { id } });
        }
        catch (error) {
            this.logger.error(error, `Failed to update user by ID ${id}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    async deleteById(id) {
        try {
            return await this.model.destroy({ where: { id } });
        }
        catch (error) {
            this.logger.error(error, `Failed to delete user by ID ${id}`);
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    create(user) {
        try {
            return this.model.build(user);
        }
        catch (error) {
            this.logger.error(error, "Failed to build user");
            throw new common_1.InternalServerErrorException(errors_enum_1.Errors.INTERNAL_ERROR);
        }
    }
    buildMatchQuery(search) {
        return `MATCH(firstName, lastName) AGAINST (REPLACE('${this.toPartialSearch(search)} ${this.toFullWordSearch(search)}', '@', '|') IN BOOLEAN MODE)`;
    }
    toPartialSearch(search) {
        return this.cleanupWords(search)
            .map((w) => w && `${w}*`)
            .join(" ");
    }
    toFullWordSearch(search) {
        return this.cleanupWords(search)
            .map((w) => w && `"${w}"`)
            .join(" ");
    }
    cleanupWords(search) {
        return search.split(" ").map((w) => w.replace(/^[-+=><()~*"]+|[-+=><()~*"]*$/g, ""));
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = UserRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.default)),
    __param(1, (0, sequelize_1.InjectModel)(role_model_1.default)),
    __metadata("design:paramtypes", [Object, Object])
], UserRepository);
//# sourceMappingURL=user.repository.js.map