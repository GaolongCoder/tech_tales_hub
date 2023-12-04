import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, UserAuth, Article, Comment, Tag } from './entity';

export const prepareConnection = async () => {
  try {
    const AppDataSource: DataSource = new DataSource({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, UserAuth, Article, Comment, Tag],
      synchronize: false,
      logging: true,
    });
    return await AppDataSource.initialize();
  } catch (err) {
    console.log(err);
    Promise.reject(err);
  }
  return;
};
