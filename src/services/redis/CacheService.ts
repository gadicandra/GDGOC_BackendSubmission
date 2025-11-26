import redis from 'redis';

export class CacheService {
    private _client: ReturnType<typeof redis.createClient>;

    constructor() {
        this._client = redis.createClient({
            socket: {
                host: process.env.REDIS_SERVER,
            },
        });
        this._client.on('error', (error) => {
            console.error(error);
        });
        this._client.connect();
    }

    async set(key: string, value: string, expirationInSecond = 1800) {
        await this._client.set(key, value, {
            EX: expirationInSecond,
        });
    }

    async get(key: string) {
        const result = await this._client.get(key);
        if (result === null) throw new Error('Cache tidak ditemukan');
        return result;
    }

    delete(key: string) {
        return this._client.del(key);
    }
}