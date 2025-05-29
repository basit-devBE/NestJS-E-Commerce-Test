"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const common_1 = require("@nestjs/common");
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
let AuthRepository = class AuthRepository {
    async createUser(data) {
        try {
            const user = await prismaClient_1.default.user.create({
                data: {
                    email: data.email,
                    password: data.password,
                    name: data.name,
                }
            });
            return user;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create user: ${error.message}`);
            }
            else {
                throw new Error("An unexpected error occurred while creating the user.");
            }
        }
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)()
], AuthRepository);
//# sourceMappingURL=auth.repository.js.map