const STATUSES = ["enabled", "enabled", "enabled", "enabled", "disabled"];
const LETTERS = ["A", "B", "C", "E", "H", "K", "M", "O", "P", "T", "X"];
const LIGHTS_STATES = ["on", "off"];
const LOCK_STATES = ["locked", "unlocked"];

const choose = (choices) => {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateNumber = () => {
  const letters = [choose(LETTERS), choose(LETTERS)];
  const number = randomIntFromInterval(0, 9999);
  return letters.join("") + number.toString().padStart(4, "0");
};

const generateScooters = (count, modelIds) => {
  const numbers = [];
  const scooters = [];

  for (let i = 0; i < count; i++) {
    const modelId = choose(modelIds);
    const status = choose(STATUSES);

    let number = generateNumber();
    while (numbers.includes(number)) {
      number = generateNumber();
    }
    numbers.push(number);

    scooters.push({ number, model_id: modelId, status });
  }

  return scooters;
};

const generatePings = () => {
  const pings = [];

  const scooters = shuffle(db.scooters.find().toArray());
  const parkings = db.parkings.find().toArray();

  for (let i = 0; i < scooters.length; i++) {
    const date = new Date();
    date.setTime(date.getTime() - randomIntFromInterval(1000, 3 * 60 * 1000));

    pings.push({
      scooter_id: scooters[i]._id,
      date,
      location: choose(parkings).location,
      battery_level: randomIntFromInterval(0, 100),
      lock_state: choose(LOCK_STATES),
      lights_state: choose(LIGHTS_STATES),
    });
  }

  return pings;
};

db.createCollection("scooterManufacturers");
const { insertedId: scooterManufacturerId } = db.scooterManufacturers.insertOne(
  { title: "Ninebot" }
);

db.createCollection("scooterModels");
const { insertedId: modelAId } = db.scooterModels.insertOne({
  manufacturer_id: scooterManufacturerId,
  title: "KickScooter Max G30",
  single_charge_mileage: 65,
  weight: 20,
  max_speed: 25,
  max_load: 100,
  year: 2022,
});
const { insertedId: modelBId } = db.scooterModels.insertOne({
  manufacturer_id: scooterManufacturerId,
  title: "KickScooter F25",
  single_charge_mileage: 20,
  weight: 15,
  max_speed: 25,
  max_load: 100,
  year: 2021,
});

db.createCollection("scooters");
const scooters = generateScooters(2000, [modelAId, modelBId]);
db.scooters.insertMany(scooters);

db.createCollection("pings");
const pings = generatePings();
db.pings.insertMany(pings);
