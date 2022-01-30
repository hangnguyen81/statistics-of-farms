# Statistics of Farms
## Description of the project
### Purpose 
The Statistics of Farm project aim to provide a web service which displays data from various farms. The project also offers free open API, allows users ability to access & change data in database of farm.
### Features
- [x] Display a map which shows the location of the farms
- [x] Show data of farm in table format
- [x] Pagination of display data 
- [x] Filtering data by name of farms; type of metrics (sensorType) and date (day, month and year)
- [x] Parsing and validation of CSV data ([Data Source from Solita](https://github.com/solita/dev-academy-2022-exercise))
- [x] Endpoints to fetch data from farms with different granularities (by month, by metric)
- [x] Endpoints to store new data of farm
- [x] Endpoint to managing farms (create, view, delete and update)
- [x] Tests for all endpoints in backend

## Technology choices
This project was built with MERN tech stack (MongoDB, Express, React and Nodejs).

## Tests
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
