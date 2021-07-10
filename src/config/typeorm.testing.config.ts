import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmTestingConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'academy-test',
  // entities: [__dirname + '/../**/*.entity.{ts,js}'],
  autoLoadEntities: true,
  synchronize: true,
  keepConnectionAlive: true,
};
