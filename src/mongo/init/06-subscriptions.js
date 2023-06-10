db.createCollection("subscriptions");
db.subscriptions.insertMany([
  {
    title: "Подписка на месяц",
    price: 24900,
    duration: 2678400,
  },
  {
    title: "Подписка на 3 месяца",
    price: 74700,
    duration: 8035200,
  },
  {
    title: "Подписка на 6 месяцев",
    price: 149400,
    duration: 16070400,
  },
]);
