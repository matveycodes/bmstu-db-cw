/**
 * @group integration
 */

import { createPgPool } from "../../../db/pg";
import { TOTP } from "../../../vo/totp";

import { TOTPPGRepo } from "../totp-repo";

const pgPool = createPgPool();

const totpRepo = new TOTPPGRepo(pgPool);

afterEach(async () => {
  await pgPool.query("TRUNCATE totp CASCADE");
});

it("Сохраняет код", async () => {
  const totp: TOTP = {
    code: 123456,
    dateSent: new Date(),
    signature: "ABC",
    phone: "79991234567",
  };

  await totpRepo.save(totp);
});

it("Возвращает код по подписи", async () => {
  const totp: TOTP = {
    code: 123456,
    dateSent: new Date(),
    signature: "ABC",
    phone: "79991234567",
  };
  await totpRepo.save(totp);

  await expect(totpRepo.getBySignature("ABC")).resolves.toHaveProperty(
    "code",
    123456
  );
});
