// Delivery location array
var g_DeliveryLocations = [];

// Vehicle array
var g_Vehicles = [];

// Delivery Locations Markers
var g_DeliveryLocattionsMarkers = [];

class Location { 
    constructor(location_name, lat, lng) {
        this.location_name = location_name;
        this.lat = lat;
        this.lng = lng;
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

        g_DeliveryLocattionsMarkers.push(marker);
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
    }
}

class Vehicles {
    constructor(vehicle_id, vehicle_name, vehicle_location) {
        this.vehicle_id = vehicle_id;
        this.vehicle_name = vehicle_name;
        this.vehicle_location = vehicle_location;
    }

    getVehicleId() {
        return this.vehicle_id;
    }

    getVehicleName() {
        return this.vehicle_name;
    }

    getVehicleLocation() {
        return this.vehicle_location;
    }
}

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
    function hiddenLocationInfoList() 
    {
        for (i = 0; i < 10; i++) {
            var id = "locationInfoItem" + (i + 1);
            document.getElementById(id).style.visibility = "hidden";
        }
    }

    hiddenLocationInfoList();
    var locationKind;
    var searchBoxPosition;
    
    var map = new google.maps.Map(document.getElementById('googleMapContent'), {
        zoom: 5,
        center: {lat: 44.787197, lng: 20.457273}
    });
    
    //HARDCORDED VALUE FOR TESTING
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location(1, "Belgrade, Serbia", 44.786568, 20.44892159999995);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location(0, "Novi Sad, Serbia", 45.2671352, 19.83354959999997);
    var mainTitleHeight = 40;
    document.getElementById("addLocation").style.display = "none";
    document.getElementById("addDepotVehiclePosition").style.display = "none";
	document.getElementById("mainForm").style.height = window.innerHeight;
	var mainFormHeight = document.getElementById('mainForm').offsetHeight;
	var menuNavHeight = document.getElementById('menuNav').offsetHeight;
	mainInputFormHeight = mainFormHeight - mainTitleHeight - menuNavHeight - 12;
	document.getElementById("googleMapContent").style.height = mainFormHeight-mainTitleHeight;
	document.getElementById("mainInputForm").style.height = mainInputFormHeight ;
	document.getElementById("mainInputForm").style.border = "1px white solid";
    document.getElementById("nodata").style.marginTop = mainInputFormHeight / 2 - 80;


    function setUpStartEndPositionDesignSettings() {
        document.getElementById("nodata").style.display = "none";
        document.getElementById("addDepotVehiclePosition").style.display = "none";
    	document.getElementById("addLocation").style.display = "block";
		var inputPositionsBox = document.getElementById('locationInsertName');
		searchBoxPosition = new google.maps.places.SearchBox(inputPositionsBox);
		var locationInputText = document.getElementById('locationInputText').offsetHeight;
		var locationAddButton = document.getElementById('locationAddButton').offsetHeight ;
		document.getElementById("locationInfoList").style.height = mainInputFormHeight - locationInputText - locationAddButton;
		document.getElementById("mainInputForm").style.border = "none";
		inputPositionsBox.value="";
    }

    function setUpAddVehiclesPositionDesignSettings() {
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

    function getAllLocationName() {
        var p = [];

        for (i = 0; i < g_DeliveryLocations.length; i++) {
            p.push(g_DeliveryLocations[i].getLocationName());
        }

        return p;
    }

    function updateLocationInfoList()
    {
        console.log("Enter in updateLocationInfoList");
        //read location from the class and add to the info list. The list always reflesh after some change.
        for (i = 0; i < g_DeliveryLocations.length; i++) {
            var currentItem = "item" + (i + 1);
            var currentItemDiv = "locationInfoItem" + (i + 1);
            document.getElementById(currentItem).innerHTML = g_DeliveryLocations[i].getLocationName();
            document.getElementById(currentItemDiv).style.visibility = "visible";

        }

    }

    // Delete marker from the array
    function deleteMapMarker(index) {
        g_DeliveryLocattionsMarkers[index].setMap(null);
    }

    // Delete selected location from the array
    $scope.deleteItem = function(index) {
        deleteMapMarker(index);
        g_DeliveryLocattionsMarkers.splice(index, 1);
        g_DeliveryLocations.splice(index, 1);
        hiddenLocationInfoList();
        updateLocationInfoList();
    }

    // Reload whole page
	$scope.reloadPage = function() {
		location.reload();
	}

    // Set main settings and add placeholder to the input text
	$scope.addDeliveryLocation = function() {
		setUpStartEndPositionDesignSettings();
		document.getElementById("locationInsertName").placeholder = "Enter location name...";
	}

    // Add delivery location to the global array g_DeliveryLocations
	$scope.addDeliveryLocationToArray = function() {
		var places = searchBoxPosition.getPlaces();
        
        var location_name = places[0].formatted_address;
        var lat = places[0].geometry.location.lat();
		var lng = places[0].geometry.location.lng();

        g_DeliveryLocations[g_DeliveryLocations.length] = new Location(location_name, lat, lng);

        var marker_color = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

		g_DeliveryLocations[g_DeliveryLocations.length-1].addMapMarker(map, marker_color);
		document.getElementById('locationInsertName').value="";
        updateLocationInfoList();
	}


	$scope.addDepotVehicle = function() {
        setUpAddVehiclesPositionDesignSettings();
	}

	$scope.computeRoute = function() {

        var deliveryLocations = [];

        for(var i = 0; i < g_DeliveryLocations.length; i++)
        {
            console.log(g_DeliveryLocations[i].getLocationName() + g_DeliveryLocations[i].getLatitude() + g_DeliveryLocations[i].getLongitude());
            var obj = {"lat": g_DeliveryLocations[i].getLatitude(), "lng": g_DeliveryLocations[i].getLongitude()};
            deliveryLocations.push(obj);
        }

        // var strVehicles = "{\"vehicles\":[";
        // for (i = 0; i < g_Vehicles.length; i++) {
        //     var id = "\"id\":" + "\"" + g_Vehicles[i].getVehicleId() + "\"";
        //     var location = "\"location\":" + "\"" + g_Vehicles[i].getVehicleLocation() + "\"";
        //     strVehicles += "{" + id + "," + location + "}";
        //     if (i < (g_Vehicles.length-1)) {
        //         strVehicles += ",";
        //     }
        // }
        // strVehicles += "]}";
        // console.log(strVehicles);

        var service = new google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
            origins: deliveryLocations,
            destinations: deliveryLocations,
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
                        // Response from vrp server
                        console.log(this.responseText);
                    }
                }
                // gmResponse from google map api server
                console.log(gmResponse);
                xmlhttp.open("POST", "server/main.php?l=" + JSON.stringify(gmResponse),  true);
                xmlhttp.send();
            }
        });

        // var directionsService = new google.maps.DirectionsService;
        // var directionsDisplay = new google.maps.DirectionsRenderer;
        // directionsDisplay.setMap(map);
        // calculateAndDisplayRoute(directionsService, directionsDisplay);
	}
})
