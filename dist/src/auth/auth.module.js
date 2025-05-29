"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const validate_1 = require("../utils/validate");
const auth_schema_1 = require("./auth.schema");
let AuthModule = class AuthModule {
    configure(consumer) {
        consumer
            .apply((0, validate_1.validateRequest)(auth_schema_1.registerUserDto))
            .forRoutes({ path: '/auth/register', method: common_1.RequestMethod.POST });
        consumer
            .apply((0, validate_1.validateRequest)(auth_schema_1.verifyUserDto))
            .forRoutes({ path: '/auth/verify', method: common_1.RequestMethod.POST });
        consumer
            .apply((0, validate_1.validateRequest)(auth_schema_1.loginUserDto))
            .forRoutes({ path: '/auth/login', method: common_1.RequestMethod.POST });
    }
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map