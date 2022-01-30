const farmsRouter = require('express').Router();
const Farm = require('../models/farm');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Farm:
 *        type: object
 *        required:
 *          - name
 *          - geometry
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the farm
 *          address:
 *            type: string
 *            description: Address of the farm
 *          owner:
 *            type: string
 *            description: Name of farm's owner
 *          geometry:
 *            type: array
 *            description: Latitude and Longtitude of farm's location
 *        example:
 *          name: 'Farm for test API'
 *          address: "Somewhere in Vantaa, 01510 Vantaa, Finland"
 *          owner: "Hang Nguyen"
 *          geometry: [60.30666667, 25.0222322]
 */

/**
 * @swagger
 * tags:
 *  name: Farms
 *  description: API for managing farms
 */

/**
 * @swagger
 * /api/v1/farms:
 *  get:
 *    summary: Returns a list of farms.
 *    tags: [Farms]
 *    responses:
 *      200:
 *        description: The list of farms
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Farm'
 */

farmsRouter.get('/', async(request, response) => {
  const farms = await Farm.find({});
  response.json(farms.map(farm => farm.toJSON()));
});

/**
 * @swagger
 * /api/v1/farms/{id}:
 *  get:
 *    summary: Returns a farm with id.
 *    tags: [Farms]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the farm id
 *    responses:
 *      200:
 *        description: information of farm by id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Farm'
 *      404:
 *        description: The farm was not found
 */

farmsRouter.get('/:id', async(request, response) => {
  const farm = await Farm.findById(request.params.id);
  if (farm) {
    response.json(farm.toJSON());
  } else {
    response.status(404).end();
  }
});

/**
 * @swagger
 * /api/v1/farms:
 *  post:
 *    summary: Create a new farm
 *    tags: [Farms]
 *    requestBody:
 *      requried: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/Farm'
 *    responses:
 *      200:
 *        description: A farm created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Farm'
 *
 */

farmsRouter.post('/', async(request, response) => {
  const body = request.body;

  const farm = new Farm({
    name: body.name,
    address: body.address,
    owner: body.owner,
    geometry: body.geometry
  });
  const savedFarm = await farm.save();
  response.json(savedFarm.toJSON());
});

/**
 * @swagger
 * /api/v1/farms/{id}:
 *  put:
 *    summary: Update information of farm by Id
 *    tags: [Farms]
 *    requestBody:
 *      requried: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/Farm'
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Id of farm which you want to update
 *    responses:
 *      200:
 *        description: Update successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Farm'
 */

farmsRouter.put('/:id', async(request, response) => {
  const body = request.body;

  const farm = {
    name: body.name,
    address: body.address,
    owner: body.owner,
    geometry: body.geometry
  };

  const updatedFarm = await Farm.findByIdAndUpdate(request.params.id, farm, { new: true });
  response.json(updatedFarm.toJSON());

});

/**
 * @swagger
 * /api/v1/farms/{id}:
 *  delete:
 *    summary: Delete a farm by Id
 *    tags: [Farms]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id of a farm
 *    responses:
 *      204:
 *        description: Deleted successfully
 *      404:
 *        description: The farm is not found
 */

farmsRouter.delete('/:id', async(request, response) => {
  await Farm.findByIdAndDelete(request.params.id);
  response.status(204).end('Delete successfully');
});

module.exports = farmsRouter;