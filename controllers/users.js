const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.post('/', async(request, response) => {
  const body = request.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);
  const newUser = new User(
    {
      username: body.username,
      name: body.name,
      passwordHash
    }
  );
  const savedUser = await newUser.save();
  response.json(savedUser.toJSON());
});

module.exports = usersRouter;