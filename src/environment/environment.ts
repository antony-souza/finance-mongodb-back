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
  public readonly redisHost: string = process.env.REDIS_HOST ?? '';
  public readonly redisPort: number = parseInt(process.env.REDIS_PORT ?? '');
  public readonly redisPassword: string = process.env.REDIS_PASSWORD ?? '';
}

export const environment = new Environment();
