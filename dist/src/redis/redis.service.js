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
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let RedisService = class RedisService {
    client;
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: process.env.REDIS_URL
        });
        this.client.on('error', (err) => console.error('Redis Client Error', err));
        this.client.on('connect', () => console.log('Redis Client Connected'));
        this.client.on('ready', () => console.log('Redis Client Ready'));
        this.client.connect().catch((err) => console.error('Redis Client Connection Error', err));
    }
    async set(key, value, expirationInSeconds) {
        try {
            if (expirationInSeconds) {
                await this.client.setEx(key, expirationInSeconds, value);
            }
            else {
                await this.client.set(key, value);
            }
        }
        catch (error) {
            console.error('Error setting value in Redis:', error);
            throw error;
        }
    }
    async get(key) {
        try {
            const value = await this.client.get(key);
            console.log('Value retrieved from Redis:', value);
            return value;
        }
        catch (error) {
            console.error('Error getting value from Redis:', error);
            throw error;
        }
    }
    async del(key) {
        try {
            await this.client.del(key);
        }
        catch (error) {
            console.error('Error deleting key from Redis:', error);
            throw error;
        }
    }
    async exists(key) {
        try {
            const exists = await this.client.exists(key);
            return exists > 0;
        }
        catch (error) {
            console.error('Error checking existence of key in Redis:', error);
            throw error;
        }
    }
    async delifExists(key) {
        try {
            const exists = await this.exists(key);
            if (exists) {
                await this.del(key);
            }
        }
        catch (error) {
            console.error('Error deleting key if it exists in Redis:', error);
            throw error;
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisService);
//# sourceMappingURL=redis.service.js.map