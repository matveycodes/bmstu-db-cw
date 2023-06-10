db.createCollection("settings");
db.settings.insertMany([
  { name: "MAX_BOOKINGS", value: 3 },
  { name: "MAX_RENTALS", value: 10 },
  { name: "MIN_AGE", value: 18 },
  { name: "BOOKING_DURATION", value: 600 },
  { name: "START_PRICE", value: 5000 },
  { name: "PER_MINUTE_PRICE", value: 700 },
]);
