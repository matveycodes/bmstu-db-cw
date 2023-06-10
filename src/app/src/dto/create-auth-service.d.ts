import { UserRepo } from "../interfaces/user-repo";
import { TOTPRepo } from "../interfaces/totp-repo";
import { AuthTokenRepo } from "../interfaces/auth-token-repo";
import { SMSGateway } from "../interfaces/sms-gateway";
import { Logger } from "../interfaces/logger";

interface CreateAuthServiceDto {
  userRepo: UserRepo;
  totpRepo: TOTPRepo;
  authTokenRepo: AuthTokenRepo;
  smsGateway: SMSGateway;
  logger?: Logger;
}

export { CreateAuthServiceDto };
