export declare class RedisService {
    private client;
    constructor();
    set(key: string, value: string, expirationInSeconds?: number): Promise<void>;
    get(key: string): Promise<string | {} | null>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    delifExists(key: string): Promise<void>;
}
