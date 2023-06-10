import { TOTP } from "../vo/totp";

interface TOTPRepo {
  get(): Promise<TOTP[]>;
  getBySignature(signature: TOTP["signature"]): Promise<TOTP>;
  save(totp: TOTP): Promise<void>;
  remove(signature: TOTP["signature"]): Promise<void>;
}

export { TOTPRepo };
