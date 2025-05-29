import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";    
dotenv.config();

@Injectable()
export class RedisService {
    private client: RedisClientType;
    
    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL
        });
        
        this.client.on('error', (err: Error) => console.error('Redis Client Error', err));
        this.client.on('connect', () => console.log('Redis Client Connected'));
        this.client.on('ready', () => console.log('Redis Client Ready'));
        this.client.connect().catch((err: Error) => console.error('Redis Client Connection Error', err));
    }
    
}