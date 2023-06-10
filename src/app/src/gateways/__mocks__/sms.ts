import { SMSGateway } from "../../interfaces/sms-gateway";
import { Logger } from "../../interfaces/logger";

class SMSMockGateway implements SMSGateway {
  private _logger?: Logger;

  constructor(logger?: Logger) {
    this._logger = logger;
  }

  private log(message: string) {
    this._logger?.log(message, this.constructor.name, "verbose");
  }

  public async sendMessage(phone: string, message: string) {
    this.log(`Отправка СМС-сообщения "${message}" на ${phone}`);
  }
}

export { SMSMockGateway };
