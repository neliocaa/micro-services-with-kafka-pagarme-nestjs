import { DataSource } from 'typeorm';

export const typeOrmConfig = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'pets',
  synchronize: true,
  migrations: ['migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
});
