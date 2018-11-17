/*
======================OBTAINING YOUR DEVICE ID=============================
	//YOU CAN FIND YOUR DEVICE ID BY using the following code
	let oAPI = new owletAPI('your username','your password')
	oAPI.getDevices().then(function(dp){ console.log(dp) })
	//RUN "node example.js" the resulting deviceArray will be displayed (it will contain dsn=deviceid)
*/

var args = process.argv.slice(2);
var owletAPI = require('./owletAPI.js')
let oAPI = new owletAPI('your username','your password','your device id')

var action = args[0]
if (action == 'on') oAPI.setProperty('BASE_STATION_ON','1')
else if (action == 'off') oAPI.setProperty('BASE_STATION_ON','0')
else oAPI.getProperties().then(function(dp){ console.log(JSON.stringify(dp)) })

//oAPI.getDevices().then(function(dp){	console.log(dp) })
//oAPI.getProperties().then(function(dp){	console.log(dp) })
//setProperty('APP_ACTIVE','1').then(function(status){console.log(status)})
//setProperty('BASE_STATION_ON','1').then(function(status){console.log(status)})
//setProperty('BASE_STATION_ON','1').then(function(status){console.log(status)})