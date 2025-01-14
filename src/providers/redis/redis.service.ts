import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { environment } from 'src/environment/environment';

@Injectable()
export class RedisServices extends Redis {
  private readonly logger = new Logger(RedisServices.name);
  constructor() {
    super({
      host: environment.redisHost,
      port: environment.redisPort,
      password: environment.redisPassword,
      maxRetriesPerRequest: 5,
    });
  }

  async getValue(key: string): Promise<string> {
    return await this.get(key);
  }

  async setValue(key: string, value: string, timeExp: number): Promise<string> {
    return await this.set(key, value, 'EX', timeExp);
  }

  async deleteValue(key: string): Promise<number> {
    return await this.del(key);
  }

  async testConnect() {
    try {
      this.ping();
      this.logger.debug(
        `Redis is Running: ${environment.redisHost}:${environment.redisPort}`,
      );
    } catch (error) {
      this.logger.error('Redis not connected', error, 'Redis');
    }
  }
}

export const connectedRedis = async (): Promise<void> => {
  await new RedisServices().testConnect();
};
