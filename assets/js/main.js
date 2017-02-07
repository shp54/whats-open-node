$(document).ready(function(){
	function showResults(data){	
		//Builds ordered list of results	
		var results = [];
		$.each(data, function(index, item){
			results.push({
				icon: item.icon,
				name: item.name,
				address: item.vicinity
			});
		});

		var template = Handlebars.compile($("#results-template").text());
		var rendered = template({results: results});
	
		$("#results").html(rendered);
	}

	function geoSuccess(p){
		console.log("Found user's location at " + p.coords.latitude + ", " + p.coords.longitude);
		
		var params = {
			"lat": p.coords.latitude,
			"long": p.coords.longitude
		}
		
		$.get("/open?" + buildQueryString(params)) //Get response from server
			.then(JSON.parse)
			.then(function(data) {
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

	if(geoPosition.init()){
		geoPosition.getCurrentPosition(geoSuccess, geoError);
	}
});