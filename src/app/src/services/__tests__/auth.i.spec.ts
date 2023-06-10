/**
 * @group integration
 */

import { UserPGRepo, TOTPPGRepo, AuthTokenPGRepo } from "../../repos/pg";
import { createPgPool } from "../../db/pg";
import { SMSMockGateway } from "../../gateways/__mocks__/sms";
import { User } from "../../models/user";

import { AuthService } from "../auth";

const pgPool = createPgPool();

afterEach(async () => {
  await pgPool.query("TRUNCATE users, totp, auth_tokens CASCADE");
});

const userRepo = new UserPGRepo(pgPool);
const totpRepo = new TOTPPGRepo(pgPool);
const authTokenRepo = new AuthTokenPGRepo(pgPool);
const smsGateway = new SMSMockGateway();
const authService = new AuthService({
  userRepo,
  totpRepo,
  authTokenRepo,
  smsGateway,
});

it("Авторизует незарегистрированного пользователя", async () => {
  const signature = await authService.requestAuth("79991234567");
  const { code } = await totpRepo.getBySignature(signature);

  await expect(authService.auth(signature, code)).resolves.toBeTruthy();
  await expect(userRepo.getByPhone("79991234567")).resolves;
});

it("Авторизует зарегистрированного пользователя", async () => {
  const user = new User({
    id: userRepo.nextId(),
    phone: "79991234567",
    role: "customer",
    dateJoined: new Date(),
    status: "pending",
  });
  await userRepo.save(user);

  const signature = await authService.requestAuth("79991234567");
  const { code } = await totpRepo.getBySignature(signature);

  await expect(authService.auth(signature, code)).resolves.toBeTruthy();
});
