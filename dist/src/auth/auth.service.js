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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../redis/redis.service");
const auth_repository_1 = require("./auth.repository");
const bcrypt_1 = require("../shared/bcrypt");
const emailservice_1 = require("../shared/emails/emailservice");
const jwt_1 = require("../utils/jwt");
let AuthService = class AuthService {
    redisService;
    authRepository;
    emailService;
    constructor() {
        this.redisService = new redis_service_1.RedisService();
        this.authRepository = new auth_repository_1.AuthRepository();
    }
    async registerUser(data) {
        try {
            const existingUser = await this.authRepository.findUserByEmail(data.email);
            if (existingUser) {
                throw new Error("User already exists with this email address");
            }
            const hashedPassword = await (0, bcrypt_1.hashPassword)(data.password);
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresIn = new Date(Date.now() + 5 * 60 * 1000).toISOString();
            await this.redisService.delifExists(data.email);
            await this.redisService.set(data.email, JSON.stringify({ password: hashedPassword, name: data.name, Code: verificationCode, expiresIn }), 60 * 60 * 2);
            const sendEmail = await emailservice_1.EmailService.sendVerificationEmail(data.email, verificationCode, data.name, expiresIn);
            if (!sendEmail) {
                throw new Error("Failed to send verification email");
            }
            return { message: "User registered successfully. Please check your email for the verification code." };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to check existing user: ${error.message}`);
            }
            else {
                throw new Error("An unexpected error occurred while checking for existing user.");
            }
        }
    }
    async verifyUser(data) {
        try {
            const userData = await this.redisService.get(data.email);
            if (!userData) {
                throw new Error("invalid email,please register first");
            }
            const parsedData = JSON.parse(userData);
            if (parsedData.Code !== data.verificationCode) {
                throw new Error("Invalid verification code");
            }
            if (new Date(parsedData.expiresIn) < new Date()) {
                throw new Error("Verification code has expired");
            }
            const user = await this.authRepository.createUser({
                email: data.email,
                password: parsedData.password,
                name: parsedData.name
            }, true);
            if (!user) {
                throw new Error("Failed to create user");
            }
            const welcomeEmailSent = await emailservice_1.EmailService.sendWelcomeEmail(data.email, parsedData.name);
            if (!welcomeEmailSent) {
                throw new Error("Failed to send welcome email");
            }
            const accessToken = await (0, jwt_1.generateAccessToken)({ userId: user.id, email: user.email }, '2h');
            const refreshToken = await (0, jwt_1.generateAccessToken)({ userId: user.id, email: user.email }, '7d');
            const userWithoutPassword = {
                ...user,
                password: undefined
            };
            return { message: "User verified successfully. Welcome email sent.", userWithoutPassword, accessToken, refreshToken };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("An unexpected error occurred while verifying the user.");
            }
        }
    }
    async loginUser(data) {
        try {
            const user = await this.authRepository.findUserByEmail(data.email);
            if (!user) {
                throw new Error("User not found");
            }
            if (!user.isVerified) {
                throw new Error("User is not verified. Please verify your email first");
            }
            const validPassword = await (0, bcrypt_1.comparePassword)(data.password, user.password);
            if (!validPassword) {
                throw new Error("Invalid password");
            }
            const accessToken = await (0, jwt_1.generateAccessToken)({ userId: user.id, email: user.email }, '2h');
            const refreshToken = await (0, jwt_1.generateRefreshToken)({ userId: user.id, email: user.email }, '7d');
            const userWithoutPassword = {
                ...user,
                password: undefined
            };
            return { message: "User logged in successfully", userWithoutPassword, accessToken, refreshToken };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to login user: ${error.message}`);
            }
            else {
                throw new Error("An unexpected error occurred while logging in the user.");
            }
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuthService);
//# sourceMappingURL=auth.service.js.map