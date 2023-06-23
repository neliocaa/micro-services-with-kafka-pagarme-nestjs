import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NewOrderEntity } from 'src/orders/new-order.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'pets',
  entities: [NewOrderEntity],
  synchronize: false,
  autoLoadEntities: true,
};
