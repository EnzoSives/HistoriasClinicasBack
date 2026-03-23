import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '66.97.45.96',
  port: 3306,
  username: 'base_enzo',
  password: '%#zn7ajqx0qrljLr',
  database: 'historias_clinicas_pruebas',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
});
