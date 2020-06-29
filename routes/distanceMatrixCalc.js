const distance = require('google-distance-matrix');
const path = require('path')
const fs = require('fs')
require('dotenv').config()

distance.key(process.env.API_KEY);

distance.units('imperial');


exports.getDistance = (o,d,m) => {

	
	let origins = o;
	let destinations = d;
	let mode = m;


	try {
		/* 
		Default mode is driving, if no mode selected driving will be set as default
		*/

		distance.mode(mode);
		let resp = {};
		resp.origin = o[0];
		resp.destination = d[0];
		resp.mode = m;
		let flag = 0;
		

		distance.matrix(origins, destinations, function (err, distances) {
			if (err) {
				return console.log(err);
			}
			if (!distances) {
				return console.log('no distances');
			}
			if (distances.status == 'OK') {
				for (let i = 0; i < origins.length; i++) {
					for (let j = 0; j < destinations.length; j++) {
						let origin = distances.origin_addresses[i];
						let destination = distances.destination_addresses[j];
						if (distances.rows[0].elements[j].status == 'OK') {
							let distance =
							distances.rows[i].elements[j].distance.text;
							let time =
							distances.rows[i].elements[j].duration.text;
							resp.distance = distance;
							resp.time = time;
							resp.origin_address = origin;
							resp.destination_address = destination;
							console.log(resp)

							filename = path.join(__dirname,'../public/results/')+'distance_info_'+Date.now()+'.js'
							fs.writeFile(filename, JSON.stringify(resp,null,2), (err) => { 

								if (err) throw err; 
							})
							flag = 1;
							
						}
					}
				}
			}

			/* 
			in case of origin or destination not found distance object will be pushed in the response.
			file name will be distance_info__timestamp_err.js
			*/

			if(flag == 0){
				filename = path.join(__dirname,'../public/results/')+'distance_info_'+Date.now()+'_err.js'
				resp.distances = distances
				fs.writeFile(filename, JSON.stringify(resp,null,2), (err) => { 

					if (err) throw err; 
				})
			}

			
		});
	} catch (e) {
		console.log(e)
		return res.status(403).send({
			message: 'Error!',
			data: e,
		});
	}


}