class Position { 
    constructor(location_kind, location_name, lat, lng) {
        this.location_kind = location_kind;
        this.location_name = location_name;
        this.lat = lat;
        this.lng = lng;
    }

    getLocationKind() {
        return this.location_kind;
    }

    getLocationName() {
        return this.location_name;
    }

    getLatitude() {
        return this.lat;
    }

    getLongitude() {
        return this.lng;
    }

    addMapMarker(map, marker_color) {
        
        var infowindow = new google.maps.InfoWindow({
            content: '<div id="namePlace">' + this.location_name + '</div>'
        });

        var latlng = {lat: this.lat, lng: this.lng};
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: marker_color
        });

        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
    }
}

class Vehicles {
    constructor(vehicle_name, vehicle_lat, vehicle_lng) {
        this.vehicle_name = vehicle_name;
        this.vehicle_lng = vehicle_lng;
        this.vehicle_lat = vehicle_lat;
    }

    getVehicleName() {
        return this.vehicle_name;
    }

    getVehicleLat() {
        return this.vehicle_lat;
    }

    getVehicleLng() {
        return this.vehicle_lng;
    }
}

// Location array
var g_Positions = [];
var g_PositionsNumber = 0;

// Vehicle array
var g_Vehicles = [];
var g_VehiclesNumber = 0;

var app = angular.module('vrp', ['ngRoute']);
app.config(function($routeProvider)
{
	$routeProvider
	.when("/",
	{
		templateUrl: "client/html/index.html"
	})
})

app.controller("indexController", function($location, $scope)
{
    var locationKind;
    var searchBoxPosition;
    
    var map = new google.maps.Map(document.getElementById('gmapMap'), {
        zoom: 8,
        center: {lat: 44.787197, lng: 20.457273}
    });
    
    //HARDCORDED VALUE FOR TESTING
    // g_Positions[g_PositionsNumber++] = new Position(1, "Belgrade, Serbia", 44.786568, 20.44892159999995);
    // g_Positions[g_PositionsNumber++] = new Position(0, "Novi Sad, Serbia", 45.2671352, 19.83354959999997);
    var gmapTitleLine = 40;
	document.getElementById("insertDataMessage").style.padding = "50% 0";
	document.getElementById("addPositions").style.display = "none";
	document.getElementById("mainLayout").style.height = window.innerHeight;
	var mainLayout = document.getElementById('mainLayout').offsetHeight;
	var gmapRowNav = document.getElementById('gmapRowNav').offsetHeight ;
	var gmapRowBtnCompute = document.getElementById('gmapRowBtnCompute').offsetHeight ;
	gmapInputDataHeight = mainLayout-gmapTitleLine-gmapRowBtnCompute-gmapRowNav;
	document.getElementById("gmapMap").style.height = mainLayout-gmapTitleLine;
	document.getElementById("gmapInputData").style.height = gmapInputDataHeight;
	var mainLayout = document.getElementById('insertDataMessage').offsetHeight;
	document.getElementById("gmapInputData").style.border = "1px white solid";

    function setUpStartEndPositionDesignSettings() {
    	document.getElementById("addPositions").style.display = "block";
		document.getElementById("insertDataMessage").style.display = "none";
		var inputPositionsBox = document.getElementById('txtInsertPosition');
		searchBoxPosition = new google.maps.places.SearchBox(inputPositionsBox);
		var gmapRowInputText = document.getElementById('gmapRowInputText').offsetHeight ;
		var gmapRowBtnAdd = document.getElementById('gmapRowBtnAdd').offsetHeight ;
		document.getElementById("txtaAddPositions").style.height = gmapInputDataHeight - gmapRowInputText - gmapRowBtnAdd;
		document.getElementById("gmapInputData").style.border = "none";
		inputPositionsBox.value="";
    }

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    	console.log("Enter in calculateAndDisplayRoute");
        directionsService.route({
          origin: "Belgrade, Serbia",
          destination: "Novi Sad, Serbia",
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
    }

    function addToInfoList()
    {
        //TO DO
    }


	$scope.reloadPage = function() {
		location.reload();
	}

	$scope.addStartPositions = function() {
		setUpStartEndPositionDesignSettings();
		document.getElementById("txtInsertPosition").placeholder = "Enter start position...";
		locationKind = 1;
	}

	$scope.addEndPositions = function() {
		setUpStartEndPositionDesignSettings();
		document.getElementById("txtInsertPosition").placeholder = "Enter end position...";
		locationKind = 0;
	}

	$scope.addPosition = function() {
		var places = searchBoxPosition.getPlaces();
        
        var location_name = places[0].formatted_address;
		var location_kind = locationKind
        var lat = places[0].geometry.location.lat();
		var lng = places[0].geometry.location.lng();

        g_Positions[g_PositionsNumber++] = new Position(location_kind, location_name, lat, lng);

        if (location_kind) {
			var marker_color = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
		}
		else {
			var marker_color = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
		}
		g_Positions[g_PositionsNumber-1].addMapMarker(map, marker_color);
		document.getElementById('txtInsertPosition').value="";
	}

	$scope.addVehicles = function() {
		//TODO
	}

	$scope.computeRoute = function() {

        var startPosition = [];
        var endPosition = [];

        for(var i = 0; i < g_PositionsNumber; i++)
        {
            console.log(g_Positions[i].getLocationKind() + g_Positions[i].getLocationName() + g_Positions[i].getLatitude() + g_Positions[i].getLongitude());
            var obj = {"lat": g_Positions[i].getLatitude(), "lng": g_Positions[i].getLongitude()};
            if (g_Positions[i].getLocationKind() == 1) {
                startPosition.push(obj);
            }
            else {
                endPosition.push(obj);
            }
        }

        var service = new google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
            origins: startPosition,
            destinations: endPosition,
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
        },function(gmResponse, gmStatus) {
            if (gmStatus !== 'OK') {
                alert("Distance matrix seriver: error while finding the distances");
            } 
            else {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.responseText);
                    }
                }
                xmlhttp.open("POST", "server/main.php?q=" + "Lazic", true);
                xmlhttp.send();
            }
        });

        // var directionsService = new google.maps.DirectionsService;
        // var directionsDisplay = new google.maps.DirectionsRenderer;
        // directionsDisplay.setMap(map);
        // calculateAndDisplayRoute(directionsService, directionsDisplay);
	}
})
