import { Injectable } from "@nestjs/common";
import { ConfigService } from "../config";

@Injectable()
export class Service {
  constructor(private readonly config: ConfigService) {
    console.log(config.http.port);
  }

  async hello() {
    return {
      greet: this.config.greet,
    };
  }
}