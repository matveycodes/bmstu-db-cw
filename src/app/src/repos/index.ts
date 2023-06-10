import set from "lodash/set";

import { PgPool } from "../db/pg";
import { MongoConnection } from "../db/mongo";

import { AuthTokenRepo } from "../interfaces/auth-token-repo";
import { BookingRepo } from "../interfaces/booking-repo";
import { ParkingRepo } from "../interfaces/parking-repo";
import { PingRepo } from "../interfaces/ping-repo";
import { PurchasedSubscriptionRepo } from "../interfaces/purchased-subscription-repo";
import { RentalRepo } from "../interfaces/rental-repo";
import { RestrictedZoneRepo } from "../interfaces/restricted-zone-repo";
import { ScooterManufacturerRepo } from "../interfaces/scooter-manufacturer-repo";
import { UserRepo } from "../interfaces/user-repo";
import { ScooterModelRepo } from "../interfaces/scooter-model-repo";
import { ScooterRepo } from "../interfaces/scooter-repo";
import { SettingRepo } from "../interfaces/setting-repo";
import { SubscriptionRepo } from "../interfaces/subscription-repo";
import { TOTPRepo } from "../interfaces/totp-repo";

import * as pgRepos from "./pg";
import * as mongoRepos from "./mongo";

interface Repos {
  authTokenRepo: AuthTokenRepo;
  bookingRepo: BookingRepo;
  parkingRepo: ParkingRepo;
  pingRepo: PingRepo;
  purchasedSubscriptionRepo: PurchasedSubscriptionRepo;
  rentalRepo: RentalRepo;
  restrictedZoneRepo: RestrictedZoneRepo;
  scooterManufacturerRepo: ScooterManufacturerRepo;
  scooterModelRepo: ScooterModelRepo;
  scooterRepo: ScooterRepo;
  settingRepo: SettingRepo;
  subscriptionRepo: SubscriptionRepo;
  totpRepo: TOTPRepo;
  userRepo: UserRepo;
}

interface Connections {
  pgPool: PgPool;
  mongoConnection: MongoConnection;
}

const reposImplementation = {
  authTokenRepo: {
    pg: pgRepos.AuthTokenPGRepo,
    mongo: mongoRepos.AuthTokenMongoRepo,
  },
  bookingRepo: {
    pg: pgRepos.BookingPGRepo,
    mongo: mongoRepos.BookingMongoRepo,
  },
  parkingRepo: {
    pg: pgRepos.ParkingPGRepo,
    mongo: mongoRepos.ParkingMongoRepo,
  },
  pingRepo: {
    pg: pgRepos.PingPGRepo,
    mongo: mongoRepos.PingMongoRepo,
  },
  purchasedSubscriptionRepo: {
    pg: pgRepos.PurchasedSubscriptionPGRepo,
    mongo: mongoRepos.PurchasedSubscriptionMongoRepo,
  },
  rentalRepo: {
    pg: pgRepos.RentalPGRepo,
    mongo: mongoRepos.RentalMongoRepo,
  },
  restrictedZoneRepo: {
    pg: pgRepos.RestrictedZonePGRepo,
    mongo: mongoRepos.RestrictedZoneMongoRepo,
  },
  scooterManufacturerRepo: {
    pg: pgRepos.ScooterManufacturerPGRepo,
    mongo: mongoRepos.ScooterManufacturerMongoRepo,
  },
  scooterModelRepo: {
    pg: pgRepos.ScooterModelPGRepo,
    mongo: mongoRepos.ScooterModelMongoRepo,
  },
  scooterRepo: {
    pg: pgRepos.ScooterPGRepo,
    mongo: mongoRepos.ScooterMongoRepo,
  },
  settingRepo: {
    pg: pgRepos.SettingPGRepo,
    mongo: mongoRepos.SettingMongoRepo,
  },
  subscriptionRepo: {
    pg: pgRepos.SubscriptionPGRepo,
    mongo: mongoRepos.SubscriptionMongoRepo,
  },
  totpRepo: {
    pg: pgRepos.TOTPPGRepo,
    mongo: mongoRepos.TOTPMongoRepo,
  },
  userRepo: {
    pg: pgRepos.UserPGRepo,
    mongo: mongoRepos.UserMongoRepo,
  },
} as const;

type Repo = keyof typeof reposImplementation;

type RepoStrategy<TRepo extends Repo = Repo> =
  keyof (typeof reposImplementation)[TRepo];

type ReposStrategy = {
  [K in Repo]?: RepoStrategy<K>;
};

const getRepos = (
  strategy: RepoStrategy | ReposStrategy = "pg",
  connections: Connections
) => {
  return (Object.keys(reposImplementation) as Repo[]).reduce((repos, repo) => {
    const repoStrategy =
      (typeof strategy === "string" ? strategy : strategy[repo]) ?? "pg";

    const repoImplementation =
      repoStrategy === "mongo"
        ? new reposImplementation[repo].mongo(connections.mongoConnection)
        : new reposImplementation[repo].pg(connections.pgPool);

    set(repos, repo, repoImplementation);

    return repos;
  }, {} as Repos);
};

export { getRepos };
export type { RepoStrategy };
