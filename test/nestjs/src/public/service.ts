import { Injectable } from "@nestjs/common";
import { Config } from "../config";

@Injectable()
export class Service {
  constructor(private readonly config: Config) {
    console.log(config);
  }

  async hello() {
    return {
      greet: this.config.greet,
    };
  }
}