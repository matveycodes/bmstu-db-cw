import dayjs from "dayjs";
import * as crypto from "crypto";

import { User } from "../models/user";

import { SMSGateway } from "../interfaces/sms-gateway";
import { UserRepo } from "../interfaces/user-repo";
import { TOTPRepo } from "../interfaces/totp-repo";
import { AuthTokenRepo } from "../interfaces/auth-token-repo";
import { IAuthService } from "../interfaces/auth-service";

import { NotFoundError } from "../errors/not-found-error";
import { ValidationError } from "../errors/validation-error";
import { InvalidStateError } from "../errors/invalid-state-error";

import { CreateAuthServiceDto } from "../dto/create-auth-service";

import { Logger } from "../interfaces/logger";

class AuthService implements IAuthService {
  private _userRepo: UserRepo;
  private _totpRepo: TOTPRepo;
  private _authTokenRepo: AuthTokenRepo;
  private _smsGateway: SMSGateway;
  private _logger?: Logger;

  public constructor(createAuthServiceDto: CreateAuthServiceDto) {
    this._userRepo = createAuthServiceDto.userRepo;
    this._totpRepo = createAuthServiceDto.totpRepo;
    this._smsGateway = createAuthServiceDto.smsGateway;
    this._authTokenRepo = createAuthServiceDto.authTokenRepo;
    this._logger = createAuthServiceDto.logger;
  }

  /**
   * Логирует действия сервиса.
   * @private
   *
   * @param message - Сообщение
   */
  private log(message: string) {
    this._logger?.log(message, this.constructor.name, "verbose");
  }

  /**
   * Генерирует случайный код.
   * @private
   */
  private generateCode() {
    const min = 100_000;
    const max = 999_999;

    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Генерирует случайный токен.
   * @private
   */
  private generateToken() {
    return crypto.randomBytes(64).toString("hex");
  }

  /**
   * Обрабатывает запрос на авторизацию.
   *
   * @param phone - Номер телефона пользователя
   */
  public async requestAuth(phone: string) {
    this.log(`Получен запрос на отправку кода авторизации на ${phone}`);

    const code = this.generateCode();
    this.log(`Сгенерирован одноразовый код ${code}`);

    await this._smsGateway.sendMessage(phone, `Ваш код: ${code}.`);

    const signature = this.generateToken();
    const dateSent = new Date();
    await this._totpRepo.save({ signature, code, dateSent, phone });

    return signature;
  }

  /**
   * Авторизует пользователя.
   *
   * @param signature - Подпись
   * @param code - Код
   */
  public async auth(signature: string, code: number) {
    this.log(`Получен запрос на авторизацию с кодом ${code}`);

    const totp = await this._totpRepo.getBySignature(signature);

    if (totp.code !== code) {
      throw new ValidationError("Неверный код");
    }

    if (totp.dateUsed) {
      throw new InvalidStateError("Код уже использован");
    }

    totp.dateUsed = new Date();
    await this._totpRepo.save(totp);

    let user: User;

    try {
      user = await this._userRepo.getByPhone(totp.phone);
      this.log(`Найден пользователь ${user.id} с таким телефоном`);
    } catch (error) {
      if (error instanceof NotFoundError) {
        user = new User({
          id: this._userRepo.nextId(),
          phone: totp.phone,
          status: "pending",
          role: "customer",
          dateJoined: new Date(),
        });

        this.log("Пользователь с таким телефоном не найден");
        await this._userRepo.save(user);
      } else {
        throw error;
      }
    }

    const token = this.generateToken();
    const dateExpired = dayjs().add(1, "month").toDate();
    await this._authTokenRepo.save({
      value: token,
      dateExpired,
      userId: user.id,
    });

    return token;
  }

  /**
   * Возвращает пользователя по токену.
   *
   * @param value - Значение токена
   */
  public async getUserByToken(value: string) {
    const { userId } = await this._authTokenRepo.getByValue(value);
    return this._userRepo.getById(userId);
  }
}

export { AuthService };
