import dayjs from "dayjs";
import toNumber from "lodash/toNumber";

import { UserId } from "../models/user";

import { UserRepo } from "../interfaces/user-repo";
import { SettingRepo } from "../interfaces/setting-repo";
import { Logger } from "../interfaces/logger";
import { IUserService } from "../interfaces/user-service";

import { ValidationError } from "../errors/validation-error";

import { UpdateUserDto } from "../dto/update-user";
import { CreateUserServiceDto } from "../dto/create-user-service";

class UserService implements IUserService {
  private _userRepo: UserRepo;
  private _settingRepo: SettingRepo;
  private _logger?: Logger;

  public constructor(createUserServiceDto: CreateUserServiceDto) {
    this._userRepo = createUserServiceDto.userRepo;
    this._settingRepo = createUserServiceDto.settingRepo;
    this._logger = createUserServiceDto.logger;
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
   * Возвращает всех пользователей в системе.
   */
  public async get() {
    return this._userRepo.get();
  }

  /**
   * Возвращает информацию об указанном пользователе.
   *
   * @param id - Уникальный идентификатор пользователя
   */
  public async getInfo(id: UserId) {
    return this._userRepo.getById(id);
  }

  /**
   * Обновляет информацию об указанном пользователе.
   *
   * @param id - Уникальный идентификатор пользователя
   * @param updateUserDto - Измененная информация
   */
  public async updateInfo(id: UserId, updateUserDto: UpdateUserDto) {
    this.log(`Получен запрос на обновление данных пользователя ${id}`);

    const user = await this._userRepo.getById(id);

    if (updateUserDto.birthdate && !user.birthdate) {
      const age = dayjs().diff(updateUserDto.birthdate, "years");
      const minAge = await this._settingRepo.getByName("MIN_AGE", toNumber);

      this.log(`Указана дата рождения: ${updateUserDto.birthdate}`);
      this.log(`Возраст: ${age}. Минимальный возраст: ${minAge}`);

      if (age < minAge) {
        throw new ValidationError("Возраст меньше минимального");
      } else {
        this.log("Активация профиля пользователя");

        user.birthdate = updateUserDto.birthdate;
        user.status = "active";
      }
    }

    user.middleName = updateUserDto.middleName ?? user.middleName;
    user.firstName = updateUserDto.firstName ?? user.firstName;
    user.lastName = updateUserDto.lastName ?? user.lastName;
    user.email = updateUserDto.email ?? user.email;

    await this._userRepo.save(user);
  }

  /**
   * Блокирует пользователя.
   *
   * @param id - Уникальный идентификатор пользователя
   */
  public async block(id: UserId) {
    const user = await this._userRepo.getById(id);
    user.status = "blocked";
    await this._userRepo.save(user);

    this.log(`Пользователь ${id} заблокирован`);
  }
}

export { UserService };
