import { DataSource } from 'typeorm';
import 'dotenv/config';

const dbPort = Number(process.env.DB_PORT ?? '3306');
const dbSynchronize = (process.env.DB_SYNCHRONIZE ?? 'false') === 'true';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: dbPort,
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? '',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: dbSynchronize,
});
