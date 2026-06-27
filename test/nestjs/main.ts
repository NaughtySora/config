import 'reflect-metadata';
import { loadEnvFile } from 'node:process';
loadEnvFile('.env');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/module';

const main = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.close();
};
main();
