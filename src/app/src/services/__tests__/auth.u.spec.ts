/**
 * @group unit
 */

import { UserMockRepo } from "../../repos/__mocks__/user-repo";
import { TOTPMockRepo } from "../../repos/__mocks__/totp-repo";
import { AuthTokenMockRepo } from "../../repos/__mocks__/auth-token-repo";
import { SMSMockGateway } from "../../gateways/__mocks__/sms";
import { User, UserId } from "../../models/user";
import { ValidationError } from "../../errors/validation-error";

import { AuthService } from "../auth";

const getMocks = () => {
  const userRepo = new UserMockRepo();
  const totpRepo = new TOTPMockRepo();
  const authTokenRepo = new AuthTokenMockRepo();
  const sms = new SMSMockGateway();
  const authService = new AuthService({
    userRepo,
    totpRepo,
    authTokenRepo,
    smsGateway: sms,
  });

  return { userRepo, totpRepo, authTokenRepo, sms, authService };
};

describe("requestAuth()", () => {
  it("Выполняет запрос на авторизацию", async () => {
    const { authService, totpRepo } = getMocks();

    await authService.requestAuth("79991234567");

    const [totp] = await totpRepo.get();
    expect(totp).toHaveProperty("phone", "79991234567");
  });
});

describe("auth()", () => {
  it("Бросает исключение при вводе неверного кода", async () => {
    const { authService, totpRepo } = getMocks();

    await authService.requestAuth("79991234567");

    const [totp] = await totpRepo.get();
    await expect(authService.auth(totp.signature, 123456)).rejects.toThrow(
      ValidationError
    );
  });

  it("Создает пользователя, если он не зарегистрирован", async () => {
    const { authService, totpRepo, userRepo, authTokenRepo } = getMocks();

    await authService.requestAuth("79991234567");
    const [totp] = await totpRepo.get();
    await authService.auth(totp.signature, totp.code);

    const [user] = await userRepo.get();
    expect(user).toHaveProperty("phone", "79991234567");
    await expect(authTokenRepo.getByUser(user.id)).resolves;
  });

  it("Не создает пользователя, если он уже существует", async () => {
    const { authService, totpRepo, userRepo } = getMocks();
    await userRepo.save(
      new User({
        phone: "79991234567",
        id: "42" as UserId,
        role: "customer",
        status: "pending",
        dateJoined: new Date(),
      })
    );

    await authService.requestAuth("79991234567");
    const [totp] = await totpRepo.get();
    await authService.auth(totp.signature, totp.code);

    const users = await userRepo.get();
    expect(users).toHaveLength(1);
    expect(users[0]).toHaveProperty("phone", "79991234567");
  });
});
