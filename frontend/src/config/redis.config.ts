import { createClient, RedisClientType } from "redis";

class RedisConfig {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://redis:6379",
    });

    this.client.on("error", (err) => {
      console.error("Redis connection error:", err);
    });

    this.client.on("connect", () => {
      console.log("Connected to Redis successfully.");
    });

    (async () => {
      await this.client.connect();
    })();
  }

  getClient(): RedisClientType {
    return this.client;
  }

  async set(key: string, value: string, expirationMode?: "EX", expirationTime?: number): Promise<void> {
    if (expirationMode && expirationTime) {
      await this.client.set(key, value, expirationMode, expirationTime);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}

const redisConfig = new RedisConfig();
export default redisConfig;
