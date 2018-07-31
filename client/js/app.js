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

// Location array
var g_Positions = [];

// Vehicle array
var g_Vehicles = [];

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
    function hiddenInfoListItem() 
    {
        for (i = 0; i < 10; i++) {
            var id = "vinfoitem" + (i + 1);
            document.getElementById(id).style.visibility = "hidden";
        }
    }

    hiddenInfoListItem();
    var locationKind;
    var searchBoxPosition;
    
    var map = new google.maps.Map(document.getElementById('gmapMap'), {
        zoom: 8,
        center: {lat: 44.787197, lng: 20.457273}
    });
    
    //HARDCORDED VALUE FOR TESTING
    // g_Positions[g_Positions.length] = new Position(1, "Belgrade, Serbia", 44.786568, 20.44892159999995);
    // g_Positions[g_Positions.length] = new Position(0, "Novi Sad, Serbia", 45.2671352, 19.83354959999997);
    var gmapTitleLine = 40;
	document.getElementById("insertDataMessage").style.padding = "50% 0";
    document.getElementById("addPositions").style.display = "none";
    document.getElementById("addVehiclePosition").style.display = "none";
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
        document.getElementById("addVehiclePosition").style.display = "none";
    	document.getElementById("addPositions").style.display = "block";
		document.getElementById("insertDataMessage").style.display = "none";
		var inputPositionsBox = document.getElementById('txtInsertPosition');
		searchBoxPosition = new google.maps.places.SearchBox(inputPositionsBox);
		var gmapRowInputText = document.getElementById('gmapRowInputText').offsetHeight;
		var gmapRowBtnAdd = document.getElementById('gmapRowBtnAdd').offsetHeight ;
		document.getElementById("txtaAddPositions").style.height = gmapInputDataHeight - gmapRowInputText - gmapRowBtnAdd;
		document.getElementById("gmapInputData").style.border = "none";
		inputPositionsBox.value="";
    }

    function setUpAddVehiclesPositionDesignSettings() {
        document.getElementById("addVehiclePosition").style.display = "block";
        document.getElementById("addPositions").style.display = "none";
        document.getElementById("insertDataMessage").style.display = "none";
        document.getElementById("gmapInputData").style.border = "none";
        var selectPossibleVehiclePosition = document.getElementById('selectPossibleVehiclePosition').offsetHeight;
        var btnAddVehicleStartPosition = document.getElementById('btnAddVehicleStartPosition').offsetHeight;
        document.getElementById("txtaAddVehicles").style.height = gmapInputDataHeight - selectPossibleVehiclePosition - btnAddVehicleStartPosition;

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

        for (i = 0; i < g_Positions.length; i++) {
            p.push(g_Positions[i].getLocationName());
        }

        return p;
    }

    function updateLocationInfoList()
    {
        console.log("Enter in updateLocationInfoList");
        //read location from the class and add to the info list. The list always reflesh after some change.

    }

    function updateVehicleInfoList()
    {
        console.log("Enter in updateVehicleInfoList");
        for (i = 0; i < g_Vehicles.length; i++) {
            var currentItem = "item" + (i  + 1);
            var currentItemDiv = "vinfoitem" + (i + 1);
            document.getElementById(currentItem).innerHTML = g_Vehicles[i].getVehicleName();
            document.getElementById(currentItemDiv).style.visibility = "visible";

        }
    }

    $scope.deleteItem = function(index) {
        g_Vehicles.splice(index, 1);
        hiddenInfoListItem();
        updateVehicleInfoList();

    }

	$scope.reloadPage = function() {
        
		location.reload();
	}

	$scope.addStartLocation = function() {
		setUpStartEndPositionDesignSettings();
		document.getElementById("txtInsertPosition").placeholder = "Enter start position...";
		locationKind = 1;
	}

	$scope.addEndLocation = function() {
		setUpStartEndPositionDesignSettings();
		document.getElementById("txtInsertPosition").placeholder = "Enter end position...";
		locationKind = 0;
	}

	$scope.addStartEndLocation = function() {
		var places = searchBoxPosition.getPlaces();
        
        var location_name = places[0].formatted_address;
		var location_kind = locationKind
        var lat = places[0].geometry.location.lat();
		var lng = places[0].geometry.location.lng();

        g_Positions[g_Positions.length] = new Position(location_kind, location_name, lat, lng);

        if (location_kind) {
			var marker_color = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
		}
		else {
			var marker_color = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
		}
		g_Positions[g_Positions.length-1].addMapMarker(map, marker_color);
		document.getElementById('txtInsertPosition').value="";
        updateLocationInfoList();
	}

    $scope.addVehicle = function() {

        var name = "vehicle_" + g_Vehicles.length;
        var location = document.getElementById("selectVehicleLocation").value;
        if (!(location == "")) {
            g_Vehicles[g_Vehicles.length] = new Vehicles(g_Vehicles.length, name, location);
        }

        updateVehicleInfoList();

    }

	$scope.addVehiclesPosition = function() {
        setUpAddVehiclesPositionDesignSettings();

        $('#selectVehicleLocation').children().remove().end().append('<option value="" selected disabled hidden>Choose here</option>');
        var locations = getAllLocationName();
        for (i = 0; i < locations.length; i++) {
            $("#selectVehicleLocation").append('<option value=\"'+locations[i]+'\">'+locations[i]+'</option>');
        }
	}

	$scope.computeRoute = function() {

        var startPosition = [];
        var endPosition = [];

        for(var i = 0; i < g_Positions.length; i++)
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

        var strVehicles = "{\"vehicles\":[";
        for (i = 0; i < g_Vehicles.length; i++) {
            var id = "\"id\":" + "\"" + g_Vehicles[i].getVehicleId() + "\"";
            var location = "\"location\":" + "\"" + g_Vehicles[i].getVehicleLocation() + "\"";
            strVehicles += "{" + id + "," + location + "}";
            if (i < (g_Vehicles.length-1)) {
                strVehicles += ",";
            }
        }
        strVehicles += "]}";
        console.log(strVehicles);

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
                console.log(gmResponse);
                xmlhttp.open("POST", "server/main.php?l=" + JSON.stringify(gmResponse)+"&v=" + strVehicles,  true);
                xmlhttp.send();
            }
        });

        // var directionsService = new google.maps.DirectionsService;
        // var directionsDisplay = new google.maps.DirectionsRenderer;
        // directionsDisplay.setMap(map);
        // calculateAndDisplayRoute(directionsService, directionsDisplay);
	}
})
