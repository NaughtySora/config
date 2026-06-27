import { Controller as Register, Get } from "@nestjs/common";
import { Service } from "./service";

@Register('public')
export class Controller {
  constructor(private readonly service: Service) { }

  @Get()
  async hello() {
    return this.service.hello();
  }
}
