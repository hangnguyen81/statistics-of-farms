const Farm = require('../models/farm');
const Record = require('../models/record');
const User = require('../models/user');

//helper for farms
const initialFarms = [
  {
    name: 'Friman Metsola collective',
    address: 'Rekola, 01400 Vantaa, Finland',
    owner: 'Metso Frinen',
    geometry: [60.3294982, 25.0825125]
  },
  {
    name: 'PartialTech Research Farm',
    address: 'Tikkurilantie 136, 01510 Vantaa, Finland',
    owner: 'Ville Turvinen',
    geometry: [60.29666667, 25.03333333]
  }
];

const farmsInDb = async () => {
  const farms = await Farm.find({});
  return farms.map(farm => farm.toJSON());
};

const nonExistingId = async () => {
  const farm = new Farm({ name: 'Farm will be deleted soon' });
  const savedFarm = await farm.save();
  await farm.remove();
  return savedFarm._id.toString();
};

//helper for records
const initialRecords = [
  {
    location: 'Noora farm',
    datetime: '2020-06-14T16:00:00.000Z',
    sensorType: 'pH',
    value: 5.88
  },
  {
    location: 'Friman Metsola collective',
    datetime: '2019-06-01T11:19:44.018Z',
    sensorType: 'temperature',
    value:-23
  },
  {
    location: 'PartialTech Research Farm',
    datetime: '2021-12-14T22:00:00.000Z',
    sensorType: 'rainFall',
    value:34
  }
];
const recordsInDb = async() => {
  const records = await Record.find({});
  return records.map(record => record.toJSON());
};

//helper for users
const usersInDb = async() => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

module.exports = {
  initialFarms, farmsInDb, nonExistingId,
  initialRecords, recordsInDb,
  usersInDb
};