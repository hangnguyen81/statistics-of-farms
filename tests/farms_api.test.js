const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./api_test_helper');
const app = require('../app');
const api = supertest(app);

const Farm = require('../models/farm');

beforeEach(async() => {
  await Farm.deleteMany({});
  await Farm.insertMany(helper.initialFarms);
}, 10000);

describe('Initial state of farms', () => {
  test('Data are returned as json', async() => {
    await api
      .get('/api/v1/farms')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('All farms are returned', async() => {
    const response = await api.get('/api/v1/farms');
    expect(response.body).toHaveLength(helper.initialFarms.length);
  });
}, 10000);

describe('View a specific farm', () => {
  test('A specific farm can be viewed', async() => {
    const farmsAtStart = await helper.farmsInDb();
    const farmToView = farmsAtStart[0];
    const resultFarm = await api
      .get(`/api/v1/farms/${farmToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(resultFarm.body).toEqual(farmToView);
  });
  test('Fail if given ID is not valid or existed', async() => {
    const validNonExistingId = await helper.nonExistingId();
    await api
      .get(`/api/v1/farms/${validNonExistingId}`)
      .expect(404);
  });
});

describe('Addition of a new farm', () => {
  test('A valid farm can be added', async() => {
    const newFarm = {
      name: 'Farm for test API',
      address: 'Somewhere in Vantaa, 01510 Vantaa, Finland',
      owner: 'Hang Nguyen',
      geometry: [
        60.30666667,
        25.0222322
      ]
    };
    await api
      .post('/api/v1/farms')
      .send(newFarm)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const farmsAtEnd = await helper.farmsInDb();
    expect(farmsAtEnd).toHaveLength(helper.initialFarms.length + 1);

    const names = farmsAtEnd.map(farm => farm.name);
    expect(names).toContain('Farm for test API');
  });

  test('Farm without name cannot added to database', async() => {
    const newFarm = {
      address: 'Somewhere in Vantaa, 01510 Vantaa, Finland',
      owner: 'Hang Nguyen',
      geometry: [60.32423, 25.23423]
    };
    await api
      .post('/api/v1/farms')
      .send(newFarm)
      .expect(400);
    const farmsAtEnd = await helper.farmsInDb();
    expect(farmsAtEnd).toHaveLength(helper.initialFarms.length);
  });

  test('Farm name with length less than 3 characters cannot be added', async() => {
    const newFarm = {
      name: 'Fa',
      address: 'Somewhere in Vantaa, 01510 Vantaa, Finland',
      owner: 'Hang Nguyen',
      geometry: [60.32423, 25.23423]
    };
    await api
      .post('/api/v1/farms')
      .send(newFarm)
      .expect(400);
    const farmsAtEnd = await helper.farmsInDb();
    expect(farmsAtEnd).toHaveLength(helper.initialFarms.length);
  });
}, 10000);

describe('Deletion of a farm', () => {
  test('A specific farm can be deleted', async() => {
    const farmsAtStart = await helper.farmsInDb();
    const farmToDelete = farmsAtStart[0];
    await api
      .delete(`/api/v1/farms/${farmToDelete.id}`)
      .expect(204);
    const farmsAtEnd = await helper.farmsInDb();
    expect(farmsAtEnd).toHaveLength(farmsAtStart.length - 1);
  });
}, 10000);

describe('Updation of a farm', () => {
  test('A specific farm can be updated', async() => {
    const farmsAtStart = await helper.farmsInDb();
    const farmToUpdate = farmsAtStart[0];
    const updateFarm = {
      name: 'Farm for test API',
      address: 'Somewhere in Vantaa, 01510 Vantaa, Finland',
      owner: 'Hang Nguyen',
      geometry: [
        60.30666667,
        25.0222322
      ]
    };
    await api
      .put(`/api/v1/farms/${farmToUpdate.id}`)
      .send(updateFarm)
      .expect(200);
    const farmsAtEnd = await helper.farmsInDb();
    const updatedFarm = farmsAtEnd.find(farm => farm.id === farmToUpdate.id);
    expect(updatedFarm.name).toContain('Farm for test API');
  });

  test('Fail if given ID is not valid or existed', async() => {
    const validNonExistingId = await helper.nonExistingId();
    const updateFarm = {
      name: 'Farm for test API',
      address: 'Somewhere in Vantaa, 01510 Vantaa, Finland',
      owner: 'Hang Nguyen',
      geometry: [
        60.30666667,
        25.0222322
      ]
    };
    await api
      .put(`/api/v1/farms/${validNonExistingId}`)
      .send(updateFarm)
      .expect(500);
  });
}, 10000);

afterAll(() => {
  mongoose.connection.close();
});