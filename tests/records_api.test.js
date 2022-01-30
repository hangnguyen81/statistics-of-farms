const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./api_test_helper');
const app = require('../app');
const api = supertest(app);
const Record = require('../models/record');

beforeEach(async() => {
  await Record.deleteMany({});
  await Record.insertMany(helper.initialRecords);
},10000);

describe('Initial state of records in database', () => {
  test('Data are returned as json', async() => {
    await api
      .get('/api/v1/records')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('All records are returned', async() => {
    const response = await api.get('/api/v1/records');
    expect(response.body).toHaveLength(helper.initialRecords.length);
  });
}, 10000);

describe('Filter by metric', () => {
  test('Success if metric is valid', async() => {
    const recordsInDb = await helper.recordsInDb();
    const metricToFilter = recordsInDb[0].sensorType;
    const filteredRecords = recordsInDb.filter(record => record.sensorType === metricToFilter);

    const resultRecords  = await api
      .get(`/api/v1/records/filterByMetric?metric=${metricToFilter}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultRecords.body).toHaveLength(filteredRecords.length);
    const metrics = resultRecords.body.map(item => item.sensorType);
    expect(metrics).toContain(metricToFilter);
  });
  test('No data returned if given metric is invalid', async() => {
    const notCorrectMetric = 'random_sensor';
    await api
      .get(`/api/v1/records/filterByMetric?metric=${notCorrectMetric}`)
      .expect(404);
  });
}, 10000);

describe('Filter by month', () => {
  test('Success if month is valid', async() => {
    const recordsInDb = await helper.recordsInDb();
    const monthToFilter = recordsInDb[0].datetime.getMonth() + 1;
    const filteredRecords = recordsInDb.filter(record => record.datetime.getMonth() === monthToFilter - 1);
    const resultRecords  = await api
      .get(`/api/v1/records/filterByMonth?month=${monthToFilter}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultRecords.body).toHaveLength(filteredRecords.length);

    const months = resultRecords.body.map(record => Number(record.datetime.substr(5,2)));
    expect(months).toContain(monthToFilter);
  });
  test('No data returned if given month is invalid', async() => {
    const notCorrectMonth = 13;
    await api
      .get(`/api/v1/records/filterByMonth?month=${notCorrectMonth}`)
      .expect(404);
  });
}, 10000);

describe('Addition of a new data of farm', () => {
  test('A valid data/record can be added', async() => {
    const newRecord = {
      location: 'Farm for test API',
      datetime: new Date(),
      sensorType: 'rainFall',
      value:78
    };
    await api
      .post('/api/v1/records')
      .send(newRecord)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const recordsAtEnd = await helper.recordsInDb();
    expect(recordsAtEnd).toHaveLength(helper.initialRecords.length + 1);

    const locations = recordsAtEnd.map(record => record.location);
    expect(locations).toContain('Farm for test API');
  });

  test('Fail if given data is invalid', async() => {
    const newRecord = {
      datetime: new Date(),
      sensorType: 'rainFall',
    };
    await api
      .post('/api/v1/records')
      .send(newRecord)
      .expect(400);

    const recordsAtEnd = await helper.recordsInDb();
    expect(recordsAtEnd).toHaveLength(helper.initialRecords.length);
  });
}, 10000);

afterAll(() => {
  mongoose.connection.close();
});