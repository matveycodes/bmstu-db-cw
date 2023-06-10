db.createCollection("users");
const { insertedId: userId } = db.users.insertOne({
  status: "active",
  phone: "79999999999",
  date_joined: new Date(),
  role: "customer",
});

db.createCollection("authTokens");
db.authTokens.insertOne({
  user_id: userId,
  value: "TOKEN",
  date_expired: new Date("2038-01-01T00:00:00"),
});
