import { load, register } from '../../../../main';
import { Global, Module } from '@nestjs/common';

export abstract class Config {
  abstract http: {
    port: number;
  };
  abstract greet: string;
}

const config = register(load('&'));

@Global()
@Module({
  providers: [
    {
      provide: Config,
      useValue: config,
    }
  ],
  exports: [Config],
})
export class ConfigModule { }
