const mongoose = require('mongoose');
const helper = require('./api_test_helper');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const app = require('../app');

const api = supertest(app);
beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('bimat', 10);
  const user = new User({ username: 'root', passwordHash });
  await user.save();
});

describe('Addition of new user in database', () => {
  test('Success if user info is valid', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'leo',
      name: 'Leo Minh',
      password: 'autojajuna',
    };

    await api
      .post('/api/v1/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('Fail if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Root User',
      password: 'matkhau',
    };

    const result = await api
      .post('/api/v1/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});