import * as dotenv from 'dotenv';

dotenv.config();

class Environment {
  public readonly uploadServiceType: string =
    process.env.UPLOAD_SERVICE_TYPE ?? '';
  public readonly mongoUrl: string = process.env.mongoURI ?? '';
  public readonly port: number = parseInt(process.env.PORT ?? '');
  public readonly host: string = process.env.HOST ?? '';
  public readonly secreatKey: string = process.env.SECREAT ?? '';
  public readonly databaseUrl: string = process.env.DATABASE_URL ?? '';
  public readonly redisCacheHost: string = process.env.REDIS_CACHE_HOST ?? '';
  public readonly redisCachePort: number = parseInt(
    process.env.REDIS_CACHE_PORT ?? '',
  );
  public readonly redisCachePassword: string =
    process.env.REDIS_CACHE_PASSWORD ?? '';
}

export const environment = new Environment();
