const request = require('request')
const fs = require('fs')

class owletAPI {
	
	constructor(username,password,deviceid) {
        this.username = username
        this.password = password
		this.deviceid = deviceid
		if (!fs.existsSync('tokens')) fs.mkdirSync('tokens');
    }

	propertyOptions() {
		  return [
		  {"name": "AGE_MONTHS_OLD","display_name": "Age (Months)","key": 28426209},
		  {"name": "ALRTS_DISABLED","display_name": "Disable Alerts","key": 28426258},
		  {"name": "ALRT_SNS_BLE","display_name": "Alert Sense Ble","key": 28426259},
		  {"name": "ALRT_SNS_YLW","display_name": "Alert Sense Yellow","key": 28426260},
		  {"name": "APP_ACTIVE","display_name": "App Active","key": 28426212},
		  {"name": "BABY_NAME","display_name": "Baby's Name","key": 28426215},
		  {"name": "BASE_STATION_ON","display_name": "Base Station On","key": 28426247},
		  {"name": "BIRTHDATE","display_name": "Birthdate","key": 28426217},
		  {"name": "BLE_MAC_ID","display_name": "Sock BLE Id","key": 28426218},
		  {"name": "DEVICE_PING","display_name": "Device Ping","key": 28426255},
		  {"name": "DISABLE_LOGGED_DATA","display_name": "Disable Logged Data","key": 28426265},
		  {"name": "ELEVATION","display_name": "Elevation","key": 28426222},
		  {"name": "GENDER","display_name": "Gender","key": 28426223},
		  {"name": "LATITUDE","display_name": "Latitude","key": 28426227},
		  {"name": "LONGITUDE","display_name": "Longitude","key": 28426229},
		  {"name": "LOW_BATT_PRCNT","display_name": "Low Batt. Percent","key": 28426230},
		  {"name": "NURSERY_MODE","display_name": "Nursery Mode","key": 28426249},
		  {"name": "oem_sock_version","display_name": "oem_sock_version","key": 28426246},
		  {"name": "ON_BOARDING","display_name": "On Boarding","key": 28426243},
		  {"name": "PREMATURE","display_name": "Premature","key": 28426237},
		  {"name": "SHARE_DATA","display_name": "Share Data","key": 28426238},
		  {"name": "SOCK_DIS_APP_PREF","display_name": "Sock Dis. App Pref.","key": 28426262},
		  {"name": "SOCK_DIS_NEST_PREF","display_name": "Sock Dis. Nest Pref.","key": 28426263}
		]
	}

	login(){
		return new Promise(resolve => {
			var oAPI = this
			var request = require("request");
			var options = { method: 'POST',
			  url: 'https://user-field.aylanetworks.com/users/sign_in.json',
			  headers: 
			   { 'Postman-Token': '391ff0d5-1851-4e61-b50f-b916488f1846',
				 'cache-control': 'no-cache',
				 'Accept-Encoding': 'br, gzip, deflate',
				 'Accept-Language': 'en;q=1',
				 'User-Agent': 'Owlet/2.3.3 (iPhone; iOS 11.4; Scale/3.00)',
				 'If-Modified-Since': 'Wed, 14 Dec 2050 18:43:58 GMT',
				 Accept: '*/*',
				 'If-None-Match': '"2409584474ef811316e87c47785b67c6"',
				 Connection: 'keep-alive',
				 'Content-Type': 'application/json',
				 Host: 'user-field.aylanetworks.com' },
			  body: 
			   { user: 
				  { email: this.username,
					application: { app_id: 'OWL-id', app_secret: 'OWL-4163742' },
					password: this.password } },
			  json: true };

			request(options, function (error, response, body) {
			  if (error) throw new reject(error)
			  fs.writeFileSync('tokens/' + oAPI.username +'.json',JSON.stringify(body),{encoding:'utf8',flag:'w'});
			  resolve(body);
			});
		});
	}

	getProperties(){
		return new Promise(resolve => {
			let oAPI = this
			this.fetchToken().then(function(td) {
				oAPI.setProperty('APP_ACTIVE','1').then(function(r){ //SET APP ACTIVE FLAG (so accruate data is presented)
					var request = require("request");
					var options = { method: 'GET',
					  url: 'https://ads-field.aylanetworks.com/apiv1/dsns/' + oAPI.deviceid + '/properties.json',
					  headers: 
					   { 'Postman-Token': 'd59a7c29-cf64-47f4-b2c3-b079a65c59eb',
						 'cache-control': 'no-cache',
						 'Accept-Encoding': 'br, gzip, deflate',
						 Authorization: 'auth_token ' + td.access_token,
						 'Accept-Language': 'en;q=1',
						 'User-Agent': 'Owlet/2.3.3 (iPhone; iOS 11.4; Scale/3.00)',
						 'If-Modified-Since': 'Wed, 14 Dec 2050 18:43:58 GMT',
						 Accept: '*/*',
						 'If-None-Match': '"7ba6b343384a6c2c3e056238ef7b90ef"',
						 Connection: 'keep-alive',
						 Host: 'ads-field.aylanetworks.com' } };

					request(options, function (error, response, body) {
					  if (error) throw new Error(error);
					  let res = JSON.parse(body)
					  if (res.hasOwnProperty('error')) {
						  oAPI.removeToken()
						  oAPI.getProperties().then(function(res){resolve(res)})
					  }
					  else resolve(res)
					});
				})
			})
		});
	}

	getDevices(){
		return new Promise(resolve => {
			this.fetchToken().then(function(td) { //GET TOKEN (might already be logged in)
				var request = require("request");
				var options = { method: 'GET',
				  url: 'https://ads-field.aylanetworks.com/apiv1/devices.json',
				  headers: 
				   { 'Postman-Token': 'c8e1e40f-ea5b-41ff-990c-79b91510370e',
					 'cache-control': 'no-cache',
					 'Accept-Encoding': 'br, gzip, deflate',
					 Authorization: 'auth_token ' + td.access_token,
					 'Accept-Language': 'en;q=1',
					 'User-Agent': 'Owlet/2.3.3 (iPhone; iOS 11.4; Scale/3.00)',
					 'If-Modified-Since': 'Wed, 14 Dec 2050 18:43:58 GMT',
					 Accept: '*/*',
					 'If-None-Match': '"55ff73dd63d82bb48a76989cf6978969"',
					 Connection: 'keep-alive',
					 Host: 'ads-field.aylanetworks.com' } };

				request(options, function (error, response, body) {
				  if (error) throw new Error(error);
				  let res = JSON.parse(body)
				  if (res.hasOwnProperty('error')) {
					  removeToken()
					  getDataPoints().then(function(res){resolve(res)})
				  }
				  else resolve(res)
				});
			})
		});
	}

	setProperty(propertyName,propertyValue){
		return new Promise(resolve => {
			let propertyData = this.propertyOptions().find(x => x.name === propertyName)
			if (propertyData) {
				propertyData.value = propertyValue
				this.fetchToken().then(function(td) {
					var request = require("request");
					var options = { method: 'POST',
					  url: 'https://ads-field.aylanetworks.com/apiv1/properties/' + propertyData.key +'/datapoints.json',
					  headers: 
					   { 'Postman-Token': 'cef966c7-b295-4a7a-badb-fc34aa10745d',
						 'cache-control': 'no-cache',
						 Authorization: 'auth_token ' + td.access_token,
						 'Accept-Language': 'en;q=1',
						 'User-Agent': 'Owlet/2.3.3 (iPhone; iOS 11.4; Scale/3.00)',
						 Accept: '*/*',
						 Connection: 'keep-alive',
						 'Accept-Encoding': 'br, gzip, deflate',
						 'Content-Type': 'application/json',
						 Host: 'ads-field.aylanetworks.com' },
					  body: { datapoint: { value: propertyData.value } },
					  json: true };

					request(options, function (error, response, body) {
					  if (error) throw new Error(error);
					  resolve(body)
					});
				})
			}
			else resolve('error')
		})
	}

	async fetchToken() {
		let tokenPath = 'tokens/' + this.username + '.json'
		let tokenData = ''
		if (fs.existsSync(tokenPath)) tokenData = JSON.parse(fs.readFileSync(tokenPath))
		else tokenData = await this.login()
		return tokenData
	}

	removeToken(){
		let tokenPath = 'tokens/'+this.username+'.json'
		fs.unlinkSync(tokenPath)
	}
}

module.exports = owletAPI;

/*
//getDevices().then(function(dp){	console.log(dp) })
//getProperties().then(function(dp){ console.log(dp) })
//setProperty('APP_ACTIVE','1').then(function(status){console.log(status)})
//setProperty('BASE_STATION_ON','1').then(function(status){console.log(status)})
//setProperty('BASE_STATION_ON','1').then(function(status){console.log(status)})
*/



