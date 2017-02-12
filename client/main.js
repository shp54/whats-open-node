let $ = require('jquery'),
	AppView = require('./app');
	
function init(){
	let app = new AppView(); //Kickstart the app
}

$(document).ready(function(){	
	init();
});