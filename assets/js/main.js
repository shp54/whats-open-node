$(document).ready( function(){

if(geoPosition.init()){
	geoPosition.getCurrentPosition(geoSuccess, geoError);
}

function showResults(data){	

		//Builds ordered list of results	
		var results = [];
	
		$.each(data, function(index, item){
			var result = {
				icon: item.icon,
				name: item.name,
				address: item.vicinity
			};

			results.push(result);
		});

		var template = Handlebars.compile($("#results-template").text());
		var rendered = template({results: results});
	
		$("#results").html(rendered);
}

function geoSuccess(p){
	console.log("Found user's location at " + p.coords.latitude + ", " + p.coords.longitude);
	//AJAX this up - get JSON response from the server
	url = "/open?lat=" + p.coords.latitude + "&long=" + p.coords.longitude; //Build the URL string
	$.get(url, function(data) {
		var data = JSON.parse(data);
		if(data.status == 'OK'){
			showResults(data.results);		
		} else {
			$("#results").html("Something went wrong. We're working on it!");
		}
	});	
}

function geoError(p){
	alert("Couldn't find your location. We kind of need that");
}

});