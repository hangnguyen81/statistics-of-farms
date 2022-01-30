# Statistics of Farms
## Description of the project
### Purpose 
The Statistics of Farm project aim to provide a web service which displays data from various farms. The project also offers free open API, allows users ability to access & change data in database of farm.
### Features
- [x] Display a map which shows the location of the farms
- [x] Show data of farm in table format
- [x] Pagination of display data 
- [x] Filtering data by name of farms; type of metrics (sensorType) and date (day, month and year)
- [x] Parsing and validation of CSV data ([Data Source from Solita](https://github.com/solita/dev-academy-2022-exercise)); converted to JSON already.
- [x] Endpoints to fetch data from farms with different granularities (by month, by metric)
- [x] Endpoints to store new data of farm
- [x] Endpoint to managing farms (create, view, delete and update)
- [x] Tests for all endpoints in backend

## Technology choices
This project was built with MERN tech stack (MongoDB, Express, React and Nodejs).
API-testing with Jest, supertest

## Prerequisites
* Node.js with npm shoulde be installed in local computer, version 14.17.4 (node.js) - 6.14.14(npm) or higher, [Download node.js included npm here](https://nodejs.org/en/download/)
* A free account in MongoDB Atlas (DBaaS) should be registered [Register here](https://www.mongodb.com/atlas); Add new user (admin role) and network cluster access [Click here to see how to do it](https://www.youtube.com/watch?v=xrc7dIO_tXk) (watch from 1:00 - 4:26)
* MongoDB Compass should be installed in your local computer (we will use it to import data to MongoDB Atlas). [Download MongoDB Compass](https://www.mongodb.com/try/download/compass).
* The project works on Windows and it has not tested running on Linux yet.

## Configurations
* Open Git Bash or PowerShell.
* Change the current working directory to the location where you want the cloned directory.
* Clone the repository: `git clone https://github.com/hangnguyen81/statistics-of-farms.git`
### Import data to MongoDB Atlas
* Open MongoDB Compass from local computer and connect to a MongoDB Atlas cluster using username/password of admin user. [See step by step in here](https://www.youtube.com/watch?v=YBOiX8DwinE)
* In MongoDB Compass: create new database with database name: **farms-app**; collection: **records**.
* Access collection **records**, click **Import data** and choose file from \data\records.json
* Create new collection **farms** and import data from \data\farms.json
* Convert data type of field: **datetime** in records collection from **String** to **Date**: in mongosh window of MongoDB Compass, run 2 commands: 
````
use farms-app

db.records.updateMany(
    {},
    [{$set: 
        { datetime:
            { $toDate:"$datetime"} 
        }
    }]
)
````
### Run the project
* Run `npm install` to install all dependencies (express, nodemon, cors, dotenv, jest, cross-env, supertest, express-async-error, mongoose, mongoose-unique-validator(version 2.0.1 exactly), bcrypt, jwt, swagger-ui and swager-jsdoc)
* Create file `.env` with connection to your MongoDB database and PORT: Open MongoDB Atlas -> Databases -> Connect -> Choose: connect your application -> Select your driver (NodeJs & Version 4.0 or newer) -> then: Copy connection string provided. For example: 
````
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.kqxmo.mongodb.net/farms-app?retryWrites=true&w=majority 
PORT = 3001
//change <username> & <password> with username/password of admin user.
````
* Run the project: `nodemon index`
* Open web browser (prefer Chrome) [http://localhost:3001](http://localhost:3001) to view it in your browser

## Tests
* Using MongoDB Compass to create database for testing (e.g: database name: farms-app-test)
* Open `.env`, create new environment variable for testing
`TEST_MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.kqxmo.mongodb.net/farms-app-test?retryWrites=true&w=majority` (change username & password with username/password of admin user.)
* Run command `npm run test`

## Demo pictures of project
First view of app
![First view of app](https://i.ibb.co/nLbn4jN/01.png)

Display farm in map
![display farm in map](https://i.ibb.co/Hd35wpM/02.png)

Filter and display data in table format
![filter and display](https://i.ibb.co/WF7x8JV/03.png)

FarmsAPI
![farmsAPI & endpoints](https://i.ibb.co/27ZYqrQ/04.png)
