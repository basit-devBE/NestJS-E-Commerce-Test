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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    authservice;
    constructor() {
        this.authservice = new auth_service_1.AuthService();
    }
    async register(req, res) {
        try {
            const data = req.body;
            const result = await this.authservice.registerUser(data);
            res.status(201).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: `Failed to register user: ${error.message}` });
            }
            else {
                res.status(500).json({ message: "An unexpected error occurred while registering the user." });
            }
        }
    }
    async verify(req, res) {
        try {
            const data = req.body;
            console.log("Data received for verification:", data);
            const result = await this.authservice.verifyUser(data);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 * 1000
            });
            res.status(200).json({ message: "User verified successfully",
                user: result.userWithoutPassword,
                accessToken: result.accessToken });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: `Failed to verify user: ${error.message}` });
            }
            else {
                res.status(500).json({ message: "An unexpected error occurred while verifying the user." });
            }
        }
    }
    async login(req, res) {
        try {
            const data = req.body;
            const result = await this.authservice.loginUser(data);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 * 1000
            });
            res.status(200).json({ message: "User logged in successfully",
                user: result.userWithoutPassword,
                accessToken: result.accessToken });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: `Failed to login user: ${error.message}` });
            }
            else {
                res.status(500).json({ message: "An unexpected error occurred while logging in the user." });
            }
        }
    }
    async logout(req, res) {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            });
            res.status(200).json({ message: "User logged out successfully" });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: `Failed to logout user: ${error.message}` });
            }
            else {
                res.status(500).json({ message: "An unexpected error occurred while logging out the user." });
            }
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [])
], AuthController);
//# sourceMappingURL=auth.controller.js.map