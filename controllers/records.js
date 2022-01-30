const recordsRouter = require('express').Router();
const Record = require('../models/record');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Record:
 *        type: object
 *        required:
 *          - location
 *          - datetime
 *          - sensorType
 *        properties:
 *          location:
 *            type: string
 *            description: Name of the farm
 *          datetime:
 *            type: datetime
 *            description: Datetime when data was recorded
 *          sensorType:
 *            type: string
 *            description: Metrics type
 *          value:
 *            type: number
 *            description: data at certain datetime and metric
 *        example:
 *          location: 'Farm for test API'
 *          datetime: "2019-01-08T13:10:43.825Z"
 *          sensorType: "rainFall"
 *          value: 2.7
 */

/**
 * @swagger
 * tags:
 *  name: Records
 *  description: API for fetching data of farms
 */

/**
 * @swagger
 * /api/v1/records:
 *  get:
 *    summary: Fetch data from all farms
 *    tags: [Records]
 *    responses:
 *      200:
 *        description: The list of all data from farms
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Record'
 */

recordsRouter.get('/', async(request, response) => {
  const records = await Record.find({});
  response.json(records.map(record => record.toJSON()));
});

/**
 * @swagger
 * /api/v1/records:
 *  post:
 *    summary: Create new record of farm
 *    tags: [Records]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/Record'
 *    responses:
 *      200:
 *        description: a record of farm created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Record'
 */
recordsRouter.post('/', async(request, response) => {
  const body = request.body;

  const record = new Record({
    location: body.location,
    datetime: Date(body.datetime),
    sensorType: body.sensorType,
    value: Number(body.value)
  });
  const savedRecord = await record.save();
  response.json(savedRecord.toJSON());
});


/**
 * @swagger
 * /api/v1/records/filterByMetric:
 *  get:
 *    summary: Fetch data by metric
 *    tags: [Records]
 *    parameters:
 *      - in: query
 *        name: metric
 *        schema:
 *          type: string
 *        required: true
 *        description: type of metric to filter
 *      - in: query
 *        name: page
 *        schema:
 *          type: number
 *        description: page number of filter result
 *      - in: query
 *        name: limit
 *        schema:
 *          type: number
 *        description: number of records in filter result
 *    responses:
 *      200:
 *        description: List of filtered data by metric
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Record'
 *      404:
 *        description:  No data with provided metric
 *
 */
recordsRouter.get('/filterByMetric', async(request, response) => {
  const metric = request.query.metric;
  let page = 1;
  if (request.query.page)
    page = request.query.page;
  let limit= 10;
  if (request.query.limit)
    limit = request.query.limit;

  const records = await Record.find({ sensorType: metric })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  if(records.length !== 0)
    response.json(records.map(record => record.toJSON()));
  else
    response.status(404).end('no data with provided metric');
});


/**
 * @swagger
 * /api/v1/records/filterByMonth:
 *  get:
 *    summary: Fetch data by month
 *    tags: [Records]
 *    parameters:
 *      - in: query
 *        name: month
 *        schema:
 *          type: number
 *        required: true
 *        description: month to filter
 *      - in: query
 *        name: page
 *        schema:
 *          type: number
 *        description: page number of filter result
 *      - in: query
 *        name: limit
 *        schema:
 *          type: number
 *        description: number of records in filter result
 *    responses:
 *      200:
 *        description: List of filtered data by month
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Record'
 *      404:
 *        description:  No data with provided month
 *
 */
recordsRouter.get('/filterByMonth', async(request, response) => {
  const month = Number(request.query.month);
  let page = 1;
  if (request.query.page)
    page = request.query.page;
  let limit= 10;
  if (request.query.limit)
    limit = request.query.limit;
  const records = await Record.find({ $expr: { $eq: [{ $month: '$datetime' }, month] } })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  if(records.length !== 0)
    response.json(records.map(record => record.toJSON()));
  else
    response.status(404).end('no data with provided month');
});

module.exports = recordsRouter;