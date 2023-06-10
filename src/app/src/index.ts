import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { bearerToken } from "koa-bearer-token";
import cors from "@koa/cors";

import { createPgPool } from "./db/pg";
import { createMongoConnection } from "./db/mongo";

import * as routes from "./routes";
import * as controllers from "./controllers";
import * as services from "./services";
import { getRepos, RepoStrategy } from "./repos";

import { SMSMockGateway } from "./gateways/__mocks__/sms";
import { ScooterAPIMockGateway } from "./gateways/__mocks__/scooter-api";
import { BillingMockGateway } from "./gateways/__mocks__/billing";

import { userHandler } from "./middlewares/user";
import { errorHandler } from "./middlewares/error";
import { onReceiveLogger, onResponseLogger } from "./middlewares/logging";

import { createLogger } from "./logging/logger";

(async () => {
  const logger = createLogger(
    process.env.APP_LOG_FILE ?? "app.log",
    process.env.APP_LOG_LEVEL
  );

  const pgPool = createPgPool(logger);
  const mongoConnection = await createMongoConnection(logger);

  const dbStrategy = (process.env.DB_STRATEGY as RepoStrategy) ?? "pg";
  const repos = getRepos(dbStrategy, { pgPool, mongoConnection });

  const smsGateway = new SMSMockGateway(logger);
  const scooterApiGateway = new ScooterAPIMockGateway(logger);
  const billingGateway = new BillingMockGateway(logger);

  const bookingService = new services.BookingService({
    userRepo: repos.userRepo,
    scooterRepo: repos.scooterRepo,
    bookingRepo: repos.bookingRepo,
    rentalRepo: repos.rentalRepo,
    settingRepo: repos.settingRepo,
    pingRepo: repos.pingRepo,
    logger,
  });
  const authService = new services.AuthService({
    userRepo: repos.userRepo,
    totpRepo: repos.totpRepo,
    authTokenRepo: repos.authTokenRepo,
    smsGateway,
    logger,
  });
  const parkingService = new services.ParkingService({
    parkingRepo: repos.parkingRepo,
    pingRepo: repos.pingRepo,
  });
  const scooterService = new services.ScooterService({
    scooterRepo: repos.scooterRepo,
    pingRepo: repos.pingRepo,
    scooterModelRepo: repos.scooterModelRepo,
    scooterApiGateway,
    logger,
  });
  const restrictedZoneService = new services.RestrictedZoneService({
    restrictedZoneRepo: repos.restrictedZoneRepo,
  });
  const pingService = new services.PingService({
    pingRepo: repos.pingRepo,
    scooterService,
    restrictedZoneService,
    logger,
  });
  const userService = new services.UserService({
    userRepo: repos.userRepo,
    settingRepo: repos.settingRepo,
    logger,
  });
  const subscriptionService = new services.SubscriptionService({
    subscriptionRepo: repos.subscriptionRepo,
    purchasedSubscriptionRepo: repos.purchasedSubscriptionRepo,
    userRepo: repos.userRepo,
    billingGateway,
  });
  const tariffService = new services.TariffService({
    settingRepo: repos.settingRepo,
    subscriptionService,
  });
  const settingService = new services.SettingService({
    settingRepo: repos.settingRepo,
  });
  const rentalService = new services.RentalService({
    rentalRepo: repos.rentalRepo,
    tariffService,
    parkingService,
    scooterService,
    bookingRepo: repos.bookingRepo,
    settingRepo: repos.settingRepo,
    userRepo: repos.userRepo,
    billingGateway,
    pingService,
    logger,
  });

  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(onReceiveLogger(logger));
  app.use(bearerToken());
  app.use(userHandler(authService, logger));
  app.use(onResponseLogger(logger));
  app.use(errorHandler(logger));

  const authController = new controllers.AuthController(authService);
  app.use(routes.createAuthRouter(authController).routes());

  const bookingController = new controllers.BookingController({
    bookingService,
    scooterService,
  });
  app.use(routes.createBookingRouter(bookingController).routes());

  const parkingController = new controllers.ParkingController(parkingService);
  app.use(routes.createParkingRouter(parkingController).routes());

  const userController = new controllers.UserController(userService);
  app.use(routes.createUserRouter(userController).routes());

  const rentalController = new controllers.RentalController({
    rentalService,
    scooterService,
  });
  app.use(routes.createRentalRouter(rentalController).routes());

  const scooterController = new controllers.ScooterController({
    scooterService,
    pingService,
    rentalService,
    bookingService,
  });
  app.use(routes.createScooterRouter(scooterController).routes());

  const restrictedZoneController = new controllers.RestrictedZoneController(
    restrictedZoneService
  );
  app.use(routes.createRestrictedZoneRouter(restrictedZoneController).routes());

  const tariffController = new controllers.TariffController(tariffService);
  app.use(routes.createTariffRouter(tariffController).routes());

  const settingController = new controllers.SettingController(settingService);
  app.use(routes.createSettingRouter(settingController).routes());

  const subscriptionController = new controllers.SubscriptionController(
    subscriptionService
  );
  app.use(routes.createSubscriptionRouter(subscriptionController).routes());

  const port = +(process.env.APP_PORT ?? 8080);
  app.listen(port);

  logger.log(`Сервер запущен на порте ${port}`, "app", "info");
  logger.log(`Используемое хранилище: ${dbStrategy}`, "app", "info");
})();
