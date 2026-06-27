import { Module } from '@nestjs/common';
import { Controller } from "./controller";
import { Service } from "./service";

@Module({
  controllers: [Controller],
  providers: [Service],
})
export class PublicModule { }