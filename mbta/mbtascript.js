function initMap() {

	// Center of map: South Station

	var southstat = {lat: 42.352271, lng: -71.05524200000001};

	// Create map

	var redline = new google.maps.Map(
  		document.getElementById('map'), {zoom: 13, center: southstat
  		});

	// Station data: ids and locations

	var stations = [
  	{
  		name: "Alewife",
  		id: "place-alfcl",
    	position: new google.maps.LatLng(42.395428, -71.142483)
    }, {
    	name: "Davis",
    	id: "place-davis",
    	position: new google.maps.LatLng(42.39674, -71.121815)
    }, {
    	name: "Porter Square",
    	id: "place-portr",
    	position: new google.maps.LatLng(42.3884, -71.11914899999999)
    }, {
    	name: "Harvard Square",
    	id: "place-harsq", 
    	position: new google.maps.LatLng(42.373362, -71.118956)
    }, {
    	name: "Central Square",
    	id: "place-cntsq",
    	position: new google.maps.LatLng(42.365486, -71.103802)
    }, {
    	name: "Kendall/MIT",
    	id: "place-knncl",
    	position: new google.maps.LatLng(42.36249079, -71.08617653)
    }, {
    	name: "Charles/MGH",
    	id: "place-chmnl",
    	position: new google.maps.LatLng(42.361166, -71.070628)
    }, {
    	name: "Park Street",
    	id: "place-pktrm",
    	position: new google.maps.LatLng(42.35639457, -71.0624242)
    }, {
    	name: "Downtown Crossing",
    	id: "place-dwnxg",
    	position: new google.maps.LatLng(42.355518, -71.060225)
    }, {
    	name: "South Station",
    	id: "place-sstat",
    	position: new google.maps.LatLng(42.352271, -71.05524200000001)
    }, {
    	name: "Broadway",
    	id: "place-brdwy",
    	position: new google.maps.LatLng(42.342622, -71.056967)
    }, {
    	name: "Andrew",
    	id: "place-andrw",
    	position: new google.maps.LatLng(42.330154, -71.057655)
    }, {
    	name: "JFK/UMass",
    	id: "place-jfk",
    	position: new google.maps.LatLng(42.320685, -71.052391)
    }, {
    	name: "North Quincy",
    	id: "place-nqncy",
    	position: new google.maps.LatLng(42.275275, -71.029583)
    }, {
    	name: "Wollaston",
    	id: "place-wlsta",
    	position: new google.maps.LatLng(42.2665139, -71.0203369)
    }, {
    	name: "Quincy Center",
    	id: "place-qnctr",
    	position: new google.maps.LatLng(42.251809, -71.005409)
    }, {
    	name: "Quincy Adams",
    	id: "place-qamnl",
    	position: new google.maps.LatLng(42.233391, -71.007153)
    }, {
    	name: "Braintree",
    	id: "place-brntn",
    	position: new google.maps.LatLng(42.2078543, -71.0011385)
    }, {
    	name: "Savin Hill",
    	id: "place-shmnl",
    	position: new google.maps.LatLng(42.31129, -71.053331)
    }, {
    	name: "Fields Corner",
    	id: "place-fldcr",
    	position: new google.maps.LatLng(42.300093, -71.061667)
    }, {
    	name: "Shawmut",
		id: "place-smmnl",
    	position: new google.maps.LatLng(42.29312583, -71.06573796000001)
    }, {
    	name: "Ashmont",
    	id: "place-asmnl",
    	position: new google.maps.LatLng(42.284652, -71.06448899999999)
    }];

    // Store JSON URL without stop_id key

    var jsonurl = "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=";

	// Create station markers: icon and infowindow

	stations.forEach(function(station) {
        var stationcontent;
        
        // Icon

        var marker = new google.maps.Marker({
            position: station.position,
            icon: "mbtaicon.png",
            map: redline 
        });

        // InfoWindow

        var stationWindow = new google.maps.InfoWindow({
            position: station.position,
            maxWidth: 600
        });

        // On click of infoWindow, create and execute XHR request for station info

        marker.addListener('click', function() {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function()
            {
                var arr_times = ""; 
                var arr_time, direction, parsed;
                var directions = "";
                if (xhr.readyState == 4 && xhr.status == 200) {
                    parsed = JSON.parse(xhr.responseText);
                    parsed.data.forEach(function(train) {
                        arr_time = train.attributes.arrival_time;
                        if (arr_time != null)
                            arr_time = train.attributes.arrival_time.slice(11, 19);
                        else
                            arr_time = "N/A";
                        
                        if (train.attributes.direction_id)
                            direction = "Alewife";
                        else
                            direction = "Ashmont/Braintree";
                        
                        arr_times += arr_time + "<br>";
                        directions += direction + "<br>";
                    });
                    stationcontent = '<div id="content"> <h1>Upcoming trains for <span class="keyword">' +
                                 station.name + ':</span></h1><div class="row">' + 
                                 '<div class="column"><h2>Arrival Time</h2><br>' +
                                 arr_times +
                                 '</div><div class="column"><h2>Direction</h2><br>' +
                                 directions + '</div>';
                    stationWindow.setContent(stationcontent);
                    stationWindow.open(redline, marker);
                    
                } else {
                    stationcontent = '<div id="content"> <h1>Upcoming trains:</h1>' +
                                 '<div class="row">' + 
                                 '<div class="column"><h2>Arrival Time</h2><br>' +
                                 'Could not load data' +
                                 '</div><div class="column">Departure Time<br>' +
                                 'Could not load data</div>';
                    stationWindow.setContent(stationcontent);
                    stationWindow.open(redline, marker);
                }
            }            
            xhr.open("GET", (jsonurl + station.id), true);
            xhr.send();
        });
    });

	// Extract station positions to array

	var positions = Array();
	for (var i = 0; i<stations.length; i++) {
    	var pos = stations[i].position;
		positions.push(pos);
	}

	// Create polylines to connect stations

	var alewife_jfk = new google.maps.Polyline({
    	path: positions.slice(0, 13),
    	geodesic: true,
    	strokeColor: '#FF0000',
    	strokeOpacity: 1.0,
    	strokeWeight: 2 
    });

	var jfk_braintree = new google.maps.Polyline({
    	path: positions.slice(12, 18),
    	geodesic: true,
    	strokeColor: '#FF0000',
    	strokeOpacity: 1.0,
    	strokeWeight: 2 
    });

    var jfk_ashmont = new google.maps.Polyline({
    	path: [positions[12]].concat(positions.slice(18)),
    	geodesic: true,
    	strokeColor: '#FF0000',
    	strokeOpacity: 1.0,
    	strokeWeight: 2 
    });

    alewife_jfk.setMap(redline);
    jfk_braintree.setMap(redline);
    jfk_ashmont.setMap(redline);

    // Setting geolocation: icon and infowindow

    var geocontent, geopositon, geomarker, geoinfoWindow, geopolyline;
    if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			geoposition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    		
            // Calculating closest station

            var minmeters = 9999999999;
            var closeststation, distance, minmiles;
            stations.forEach(function(station) {
                distance = google.maps.geometry.spherical.computeDistanceBetween(geoposition, station.position);
                if (distance < minmeters) {
                    minmeters = distance;
                    closeststation = [station.name, station.position];
                }
            });
            minmiles = minmeters * 0.00062137;
            minmiles = minmiles.toFixed(3);
            geopolyline = new google.maps.Polyline({
                path: [geoposition, closeststation[1]],
                geodesic: true,
                strokeColor: '#0050FF',
                strokeOpacity: 1.0,
                strokeWeight: 2 
            });
            geopolyline.setMap(redline);

            geocontent = '<div id="content"> <h1>You are here!</h1>' +
                         '<p> The closest station to you is <span class="keyword">' +
                         closeststation[0] + '</span>, which is <span class="keyword">' +
                         minmiles + '</span> miles away.</div>';

            geoinfoWindow = new google.maps.InfoWindow({
                content: geocontent,
                position: geoposition,
                maxWidth: 200
            });
    	   
    		geomarker = new google.maps.Marker({
				position: geoposition,
				map: redline,
				title: 'You are here'
			});
            
            geomarker.addListener('click', function() {
                geoinfoWindow.open(redline, geomarker);
            });

            redline.setCenter(geoposition);

		}, function() {
            var errorinfoWindow = new google.maps.InfoWindow({
                position: southstat,
                content: "Could not determine geolocation"
            });

        });
    }
}










