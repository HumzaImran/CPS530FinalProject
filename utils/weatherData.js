const request = require('request');
const constants = require('../config');

const weatherData = (address, callback) => {
    const url = constants.opeanWeatherMap.BASE_URL  + encodeURIComponent(address)  +  '&appid=' + constants.opeanWeatherMap.API_KEY;
    console.log(url)
    request({url, json:true}, (error, {body}) =>{

        if(error){
            callback("Can't fetch data open weather map api", undefined)
        } else if(!body.main || !body.main.temp || !body.name || !body.weather) {
            callback("No city found", undefined)
        }else {
            callback(undefined, { 
                temperature: body.main.temp,
                description: body.weather[0].description,
                cityName: body.name

            })

        }
    })
}

module.exports = weatherData;

