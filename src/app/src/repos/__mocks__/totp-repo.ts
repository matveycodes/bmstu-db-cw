import { TOTPRepo } from "../../interfaces/totp-repo";

import { TOTP } from "../../vo/totp";

import { NotFoundError } from "../../errors/not-found-error";

class TOTPMockRepo implements TOTPRepo {
  private _totps: TOTP[] = [];

  public async get() {
    return this._totps;
  }

  public async getBySignature(signature: TOTP["signature"]) {
    const totp = this._totps.find((t) => t.signature === signature);
    return totp || Promise.reject(new NotFoundError("Код не найден"));
  }

  public async remove(signature: TOTP["signature"]) {
    this._totps = this._totps.filter((t) => t.signature !== signature);
  }

  public async save(totp: TOTP) {
    await this.remove(totp.signature);
    this._totps.push(totp);
  }
}

export { TOTPMockRepo };
