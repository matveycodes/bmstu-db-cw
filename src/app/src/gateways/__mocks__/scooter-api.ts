import { ScooterId } from "../../models/scooter";

import {
  ScooterAPIGateway,
  ScooterCommand,
} from "../../interfaces/scooter-api-gateway";
import { Logger } from "../../interfaces/logger";

class ScooterAPIMockGateway implements ScooterAPIGateway {
  private _logger?: Logger;

  constructor(logger?: Logger) {
    this._logger = logger;
  }

  private log(message: string) {
    this._logger?.log(message, this.constructor.name, "verbose");
  }

  public async sendCommand(
    scooterId: ScooterId,
    command: ScooterCommand,
    ...args: unknown[]
  ) {
    this.log(`Отправка команды "${command}" (${args}) самокату ${scooterId}`);
  }
}

export { ScooterAPIMockGateway };
