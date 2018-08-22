// Delivery location array
var g_DeliveryLocations = [];

// Delivery Locations Markers
var g_DeliveryLocattionsMarkers = [];

// Depot location
var g_DepotLocation = null;

// Depot location
var g_DepotMarker = null;

// Vehicle array
var g_Vehicles = [];

class Location { 
    constructor(location_name, lat, lng, quantity) {
        this.location_name = location_name;
        this.lat = lat;
        this.lng = lng;
        this.quantity = quantity;
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

    getQuantity() {
        return this.quantity;
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
    constructor(vehicle_id, vehicle_name, vehicle_capacity) {
        this.vehicle_id = vehicle_id;
        this.vehicle_name = vehicle_name;
        this.vehicle_capacity = vehicle_capacity;
    }

    getVehicleId() {
        return this.vehicle_id;
    }

    getVehicleName() {
        return this.vehicle_name;
    }

    getVehicleCapacity() {
        return this.vehicle_capacity;
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

    function hiddenVehicleInfoList() 
    {
        for (i = 0; i < 10; i++) {
            var id = "vehicleInfoItem" + (i + 1);
            document.getElementById(id).style.visibility = "hidden";
        }
    }


    hiddenLocationInfoList();
    hiddenVehicleInfoList();
    var locationKind;
    var googleMapSearchBox;
    
    var map = new google.maps.Map(document.getElementById('googleMapContent'), {
        zoom: 4,
        center: {lat: 44.787197, lng: 20.457273}
    });
    
    //HARDCORDED VALUE FOR TESTING
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Belgrade, Serbia", 44.786568, 20.44892159999995, 300);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Novi Sad, Serbia", 45.2671352, 19.83354959999997, 400);
    // g_Vehicles[g_Vehicles.length] = new Vehicles(1, "Mercedes MAN", 400);

    var mainTitleHeight = 40;
    // Hide all input forms
    document.getElementById("addDeliveryLocation").style.display = "none";
    document.getElementById("addDepotLocation").style.display = "none";
    document.getElementById("addVehicles").style.display = "none";

    // Set height size 
	document.getElementById("mainForm").style.height = window.innerHeight;
	var mainFormHeight = document.getElementById('mainForm').offsetHeight;
	var menuNavHeight = document.getElementById('menuNav').offsetHeight;
	mainInputFormHeight = mainFormHeight - mainTitleHeight - menuNavHeight - 12;
	document.getElementById("googleMapContent").style.height = mainFormHeight-mainTitleHeight;
	document.getElementById("mainInputForm").style.height = mainInputFormHeight ;
	document.getElementById("mainInputForm").style.border = "1px white solid";
    document.getElementById("nodata").style.marginTop = mainInputFormHeight / 2 - 80;
    //Hide depot list on the start web app
    document.getElementById("depotInfoItem").style.visibility = "hidden";


    function setUpDeliveryLocationDesignSettings() {
        // Hide no need input forms
        document.getElementById("nodata").style.display = "none";
        document.getElementById("addDepotLocation").style.display = "none";
    	document.getElementById("addDeliveryLocation").style.display = "block";
        document.getElementById("addVehicles").style.display = "none";

        // Google maps settings
		var locationInsertName = document.getElementById('locationInsertName');
		googleMapSearchBox = new google.maps.places.SearchBox(locationInsertName);
        // Set height size 
		var locationInputText = document.getElementById('locationInputText').offsetHeight;
		var locationAddButton = document.getElementById('locationAddButton').offsetHeight ;
		document.getElementById("locationInfoList").style.height = mainInputFormHeight - locationInputText - locationAddButton;
        // Hide border for the mainInputForm
		document.getElementById("mainInputForm").style.border = "none";
    }

    function setUpDepotLocationDesignSettings() {
        // Hide no need input forms        
        document.getElementById("nodata").style.display = "none";
        document.getElementById("addDepotLocation").style.display = "block";
        document.getElementById("addDeliveryLocation").style.display = "none";
        document.getElementById("addVehicles").style.display = "none";
        // Google maps settings
        var depotInsertName = document.getElementById('depotInsertName');
        googleMapSearchBox = new google.maps.places.SearchBox(depotInsertName);
        // Set height size 
        var depotInputText = document.getElementById('depotInputText').offsetHeight;
        var depotAddButton = document.getElementById('depotAddButton').offsetHeight ;
        document.getElementById("depotInfoList").style.height = mainInputFormHeight - depotInputText - depotAddButton;
        // Hide border for the mainInputForm
        document.getElementById("mainInputForm").style.border = "none";

    }

    function setUpVehiclesDesignSettings() {
        // Hide no need input forms        
        document.getElementById("nodata").style.display = "none";
        document.getElementById("addDepotLocation").style.display = "none";
        document.getElementById("addDeliveryLocation").style.display = "none";
        document.getElementById("addVehicles").style.display = "block";

        // Set height size 
        var depotInputText = document.getElementById('vehicleInputValue').offsetHeight;
        var depotAddButton = document.getElementById('vehicleAddButton').offsetHeight ;
        document.getElementById("vehiclesInfoList").style.height = mainInputFormHeight - depotInputText - depotAddButton;

        // Hide border for the mainInputForm
        document.getElementById("mainInputForm").style.border = "none";

    }

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    	console.log("Enter in calculateAndDisplayRoute");

        directionsDisplay = new google.maps.DirectionsRenderer({
            polylineOptions: {
              strokeColor: "red"
            }
          });
         directionsDisplay.setMap(map);

        var waypts = [];
        waypts.push({
            location: "Provo, Serbia",
            stopover: true
        });

        waypts.push({
            location: "Sabac, Serbia",
            stopover: true
        });

        waypts.push({
            location: "Sremska Mitrovica, Serbia",
            stopover: true
        });
        directionsService.route({
          origin: "Belgrade, Serbia",
          destination: "Belgrade, Serbia",
          waypoints: waypts,
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
            document.getElementById(currentItem).innerHTML = g_DeliveryLocations[i].getLocationName() + " " + g_DeliveryLocations[i].getQuantity();
            document.getElementById(currentItemDiv).style.visibility = "visible";

        }

    }

    function updateDepotInfoList()
    {
        var depot_name = g_DepotLocation.depot_name;
        document.getElementById("depotName").innerHTML = depot_name;
        document.getElementById("depotInfoItem").style.visibility = "visible";
    }

    function updateVehicleInfoList()
    {
        for (i = 0; i < g_Vehicles.length; i++) {
            var currentItem = "vehicleItem" + (i + 1);
            var currentItemDiv = "vehicleInfoItem" + (i + 1);
            document.getElementById(currentItem).innerHTML = g_Vehicles[i].getVehicleName() + " " + g_Vehicles[i].getVehicleCapacity();
            document.getElementById(currentItemDiv).style.visibility = "visible";
        }
    }

    // Delete marker from the array
    function deleteMapMarker(index) {
        g_DeliveryLocattionsMarkers[index].setMap(null);
    }

    function addDepotMarker() {

        var infowindow = new google.maps.InfoWindow({
            content: '<div id="namePlace">' + g_DepotLocation.depot_name + '</div>'
        });

        var latlng = {lat: parseFloat(g_DepotLocation.lat), lng: parseFloat(g_DepotLocation.lng)};
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });

        g_DepotMarker = marker;
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });

    }

    function deleteDepotMarker() {
        console.log("Enter in deleteDepotMarker");
        g_DepotMarker.setMap(null);
    }

    function cleanVehicleInputField() {
        document.getElementById("vehicleInsertName").value = "";
        document.getElementById("vehicleInsertCapacity").value = "";
    }

    $scope.deleteDepotLocation = function() {
        g_DepotLocation = null;
        deleteDepotMarker();
        document.getElementById("depotInfoItem").style.visibility = "hidden";
    }


    // Delete selected location from the array
    $scope.deleteItem = function(index) {
        deleteMapMarker(index);
        g_DeliveryLocattionsMarkers.splice(index, 1);
        g_DeliveryLocations.splice(index, 1);
        hiddenLocationInfoList();
        updateLocationInfoList();
    }

    // Delete selected vehicle from the array
    $scope.deleteVehicleItem = function(index) {
        g_Vehicles.splice(index, 1);
        hiddenVehicleInfoList();
        updateVehicleInfoList();
    }

    // Reload whole page
	$scope.reloadPage = function() {
		location.reload();
	}

    // Set main settings and add placeholder to the input text
    $scope.addDeliveryLocation = function() {
        setUpDeliveryLocationDesignSettings();
        document.getElementById("locationInsertName").placeholder = "Enter location name...";
        document.getElementById("locationInsertQuantity").placeholder = "Enter quantity of goods...";
    }

    
    $scope.addDepotLocation = function() {
        setUpDepotLocationDesignSettings();
        document.getElementById("depotInsertName").placeholder = "Enter location name...";
    }

    $scope.addVehicles = function() {
        setUpVehiclesDesignSettings();
        document.getElementById("vehicleInsertName").placeholder = "Enter vehicle name...";
        document.getElementById("vehicleInsertCapacity").placeholder = "Enter vehicle capacity...";
    }

    // Add delivery location to the global array g_DeliveryLocations
	$scope.addDeliveryLocationToArray = function() {
		var places = googleMapSearchBox.getPlaces();
        
        var location_name = places[0].formatted_address;
        var lat = places[0].geometry.location.lat();
		var lng = places[0].geometry.location.lng();
        var quantity = document.getElementById("locationInsertQuantity").value;

        g_DeliveryLocations[g_DeliveryLocations.length] = new Location(location_name, lat, lng, quantity);

        var marker_color = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

		g_DeliveryLocations[g_DeliveryLocations.length-1].addMapMarker(map, marker_color);
        document.getElementById('locationInsertName').value="";
        document.getElementById('locationInsertQuantity').value="";
        updateLocationInfoList();
	}

	$scope.addDepotToObject = function() {

        if(!(g_DepotLocation == null)) {
            alert("Depot has already added. Please remove that one and try again.");
            document.getElementById('depotInsertName').value="";
            return;
        }

        var place = googleMapSearchBox.getPlaces();

        var depot_name = place[0].formatted_address;
        var lat = place[0].geometry.location.lat();
        var lng = place[0].geometry.location.lng();

        // Add depot location in JSON format
        var depot_location = "{";
        depot_location += "\"depot_name\":\"" + depot_name + "\",";
        depot_location += "\"lat\":\"" + lat + "\",";
        depot_location += "\"lng\":\"" + lng + "\"";
        depot_location += "}";
        g_DepotLocation = JSON.parse(depot_location);

        document.getElementById('depotInsertName').value="";
        addDepotMarker();
        updateDepotInfoList();
	}

    $scope.addVehicleToArray = function () {

        if (g_DepotLocation == null) {
            alert("First you have to add depot location.");
            cleanVehicleInputField();
            return;
        }

        if (g_Vehicles.length == 10) {
            alert("Maximum number of vehicles is 10.");
            cleanVehicleInputField();
            return;
        }

        var name = document.getElementById("vehicleInsertName").value;
        var capacity = document.getElementById("vehicleInsertCapacity").value;

        g_Vehicles[g_Vehicles.length] = new Vehicles(g_Vehicles.length, name, capacity);

        cleanVehicleInputField();
        updateVehicleInfoList();
    }

	$scope.calculeteTheBestRoutes = function() {

        // var locations = [];

        // for(var i = 0; i < g_DeliveryLocations.length; i++)
        // {
        //     //console.log(g_DeliveryLocations[i].getLocationName() + g_DeliveryLocations[i].getLatitude() + g_DeliveryLocations[i].getLongitude());
        //     var obj = {"lat": g_DeliveryLocations[i].getLatitude(), "lng": g_DeliveryLocations[i].getLongitude()};
        //     locations.push(obj);
        // }

        // var strVehicles = "{\"vehicles\":[";
        // for (i = 0; i < g_Vehicles.length; i++) {
        //     var id = "\"id\":" + "\"" + g_Vehicles[i].getVehicleId() + "\"";
        //     var capacity = "\"capacity\":" + "\"" + g_Vehicles[i].getVehicleCapacity() + "\"";
        //     strVehicles += "{" + id + "," + capacity + "}";
        //     if (i < (g_Vehicles.length-1)) {
        //         strVehicles += ",";
        //     }
        // }
        // strVehicles += "]}";
        // console.log(strVehicles);

        // var service = new google.maps.DistanceMatrixService;
        // service.getDistanceMatrix({
        //     origins: locations,
        //     destinations: locations,
        //     travelMode: 'DRIVING',
        //     unitSystem: google.maps.UnitSystem.METRIC,
        // },function(gmResponse, gmStatus) {
        //     if (gmStatus !== 'OK') {
        //         alert("Distance matrix seriver: error while finding the distances");
        //     } 
        //     else {
        //         var xmlhttp = new XMLHttpRequest();
        //         xmlhttp.onreadystatechange = function() {
        //             if (this.readyState == 4 && this.status == 200) {
        //                 // Response from vrp server
        //                 console.log("Response from VRP server");
        //                 console.log(this.responseText);
        //             }
        //         }
        //         // gmResponse from google map api server
        //         console.log(gmResponse);
        //         xmlhttp.open("POST", "server/main.php?l=" + JSON.stringify(gmResponse) +"&v=" + strVehicles,  true);
        //         xmlhttp.send();
        //     }
        // });

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer({map: map, suppressMarkers: true});
       // directionsDisplay.setMap(map);
        calculateAndDisplayRoute(directionsService, directionsDisplay);
	}
})
