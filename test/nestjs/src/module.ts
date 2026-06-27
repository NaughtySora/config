import { Module } from '@nestjs/common';
import { PublicModule } from './public/module';
import { ConfigModule } from './config';

@Module({
  imports: [
    ConfigModule,
    PublicModule, 
  ],
})
export class AppModule { }