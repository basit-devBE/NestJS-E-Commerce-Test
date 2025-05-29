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

    async set(key: string, value: string, expirationInSeconds?: number): Promise<void> {
        try {
            if (expirationInSeconds) {
                await this.client.setEx(key, expirationInSeconds, value);
            } else {
                await this.client.set(key, value);
            }
        } catch (error) {
            console.error('Error setting value in Redis:', error);
            throw error;
        }
    }

    async get(key: string): Promise<string | {} | null> {
        try {
            const value = await this.client.get(key);
            console.log('Value retrieved from Redis:', value);
            return value;
        } catch (error) {
            console.error('Error getting value from Redis:', error);
            throw error;
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (error) {
            console.error('Error deleting key from Redis:', error);
            throw error;
        }
    }
    async exists(key: string): Promise<boolean> {
        try {
            const exists = await this.client.exists(key);
            return exists > 0;
        } catch (error) {
            console.error('Error checking existence of key in Redis:', error);
            throw error;
        }
    }
    
    async delifExists(key: string): Promise<void> {
        try {
            const exists = await this.exists(key);
            if (exists) {
                await this.del(key);
            }
        } catch (error) {
            console.error('Error deleting key if it exists in Redis:', error);
            throw error;
        }
    }
}

