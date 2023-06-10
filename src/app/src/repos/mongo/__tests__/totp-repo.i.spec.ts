/**
 * @group integration
 */

import { TOTP } from "../../../vo/totp";
import { createMongoConnection, MongoConnection } from "../../../db/mongo";
import { TOTPRepo } from "../../../interfaces/totp-repo";

import { TOTPMongoRepo } from "../totp-repo";

let mongoConnection: MongoConnection;

let totpRepo: TOTPRepo;

beforeAll(async () => {
  mongoConnection = await createMongoConnection();

  totpRepo = new TOTPMongoRepo(mongoConnection);
});

afterEach(async () => {
  await mongoConnection.collection("totp").deleteMany();
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
