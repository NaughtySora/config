import { load, register } from '../../../../main';
import { Global, Module } from '@nestjs/common';

// can generate this
export abstract class ConfigService {
  abstract http: {
    port: number;
  };
  abstract greet: string;
}

const config = register(load('&'));

const nest = new Set([
  'onModuleInit',
  'onApplicationBootstrap',
  'onModuleDestroy',
  'beforeApplicationShutdown',
  'onApplicationShutdown',
  'then',
]);

const adapter = (config: any, redirect: Set<string>) => new Proxy({}, {
  get(_: any, key: string) {
    if (redirect.has(key)) return;
    return config[key];
  }
})

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: adapter(config, nest),
    }
  ],
  exports: [ConfigService],
})
export class ConfigModule { }
