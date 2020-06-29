const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const distanceController = require('./distanceMatrixCalc')


/* GET home page. */

router.get('/', (req, res, next) => res.render('index', { title: 'Distance Matrix API' }))

let csv_path = path.join(__dirname, '../public/csv')


/*

picking the csv file from /public/csv directory

*/


/*

Results will be saved on /public/results directory
FileName will be in the format of 'distance_info'+current_timestamp.js

*/


router.get('/get-distances', (req, res, next) => {

	const csv_data = {
		'origins':[],
		'destinations':[],
		'mode':[]
	}

	/*
	parsing the csv file and saving into csv_data object
	*/

	fs.createReadStream(csv_path+'/parameters.csv')
	.pipe(csv())
	.on('data', (data) => {
		
		csv_data['origins'].push(data[Object.keys(data)[0]])
		csv_data['destinations'].push(data[Object.keys(data)[1]])
		csv_data['mode'].push(data[Object.keys(data)[2]])
	})
	.on('end', () => {

		/* on success calling the getDistance() method from distanceController */


		for(let i=0;i<csv_data.origins.length;i++){
			origin = [];
			origin.push(csv_data.origins[i])
			destination = [];
			destination.push(csv_data.destinations[i])
			distanceController.getDistance(origin,destination,csv_data.mode[i])

		}

		return res.status(200).send({'message':'success'})
	});

});

module.exports = router;





