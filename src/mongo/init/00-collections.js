db.createCollection("authTokens");
db.createCollection("bookings");
db.createCollection("parkings");
db.createCollection("pings");
db.createCollection("purchasedSubscriptions");
db.createCollection("rentals");
db.createCollection("restrictedZones");
db.createCollection("scooterManufacturers");
db.createCollection("scooterModels");
db.createCollection("scooters");
db.createCollection("settings");
db.createCollection("subscriptions");
db.createCollection("totp");
db.createCollection("users");

db.parkings.createIndex({ location: "2dsphere" });
db.pings.createIndex({ location: "2dsphere" });
