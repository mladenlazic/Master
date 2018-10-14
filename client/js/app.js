"use strict";
// Delivery location array
var g_DeliveryLocations = [];

// Delivery Locations Markers
var g_DeliveryLocationsMarkers = [];

// Depot location
var g_DepotLocation = null;

// Depot location
var g_DepotMarker = null;

// Vehicle array
var g_Vehicles = [];

// Lenght whole route
var g_lenghtWholeRoute;

// Past route on the google maps. Those route should be deleted when we draw new routes.
var g_currentDirections = [];

var g_Method = "BF";

var g_Result = [];

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

        var latlng = {
            lat: this.lat,
            lng: this.lng
        };
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: marker_color
        });

        g_DeliveryLocationsMarkers.push(marker);
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
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "client/html/index.html"
        })
})

app.controller("indexController", function($location, $scope) {
    function hiddenLocationInfoList() {
        for (var i = 0; i < 10; i++) {
            var id = "locationInfoItem" + (i + 1);
            document.getElementById(id).style.visibility = "hidden";
        }
    }

    function hiddenVehicleInfoList() {
        for (var i = 0; i < 10; i++) {
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
        center: {
            lat: 44.787197,
            lng: 20.457273
        }
    });

    //HARDCORDED VALUE FOR TESTING
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Vlasenica, Bosnia and Herzegovina", 44.17997740000001, 18.94181960000003, 15);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Ugljevik, Bosnia and Herzegovina", 44.6939722, 18.995954900000015, 10);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Belgrade, Serbia", 44.786568, 20.44892159999995, 10);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Novi Sad, Serbia", 45.2671352, 19.83354959999997, 40);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Valjevo, Serbia", 44.2743141, 19.890339799999992, 1);
    // g_DepotLocation = JSON.parse('{"depot_name":  "Bijeljina, Bosnia and Herzegovina", "lat": "44.75695109999999", "lng": "19.215022399999953"}');
    // g_Vehicles[g_Vehicles.length] = new Vehicles(0, "Mercedes", 50);
    // g_Vehicles[g_Vehicles.length] = new Vehicles(1, "Fiat", 40);
    // g_Vehicles[g_Vehicles.length] = new Vehicles(1, "Toyota", 1);

    var mainTitleHeight = 40;
    // Hide all input forms
    document.getElementById("addDeliveryLocation").style.display = "none";
    document.getElementById("addDepotLocation").style.display = "none";
    document.getElementById("addVehicles").style.display = "none";
    document.getElementById("showResultForm").style.display = "none";
    document.getElementById("mainDivLoader").style.display = "none";
    document.getElementById("mainDivLoader").style.zIndex = "1";

    // Set height size 
    document.getElementById("mainForm").style.height = window.innerHeight;
    var mainFormHeight = document.getElementById('mainForm').offsetHeight;
    var menuNavHeight = document.getElementById('menuNav').offsetHeight;
    var mainInputFormHeight = mainFormHeight - mainTitleHeight - menuNavHeight - 12;
    document.getElementById("googleMapContent").style.height = mainFormHeight - mainTitleHeight;
    document.getElementById("mainInputForm").style.height = mainInputFormHeight;
    document.getElementById("mainInputForm").style.border = "1px white solid";
    document.getElementById("nodata").style.marginTop = mainInputFormHeight / 2 - 80;
    //Hide depot list on the start web app
    document.getElementById("depotInfoItem").style.visibility = "hidden";
    document.getElementById("chooseMethod").textContent = g_Method;

    function setUpDeliveryLocationDesignSettings() {
        // Hide no need input forms
        document.getElementById("nodata").style.display = "none";
        document.getElementById("addDepotLocation").style.display = "none";
        document.getElementById("addDeliveryLocation").style.display = "block";
        document.getElementById("addVehicles").style.display = "none";
        document.getElementById("showResultForm").style.display = "none";

        // Google maps settings
        var locationInsertName = document.getElementById('locationInsertName');
        googleMapSearchBox = new google.maps.places.SearchBox(locationInsertName);
        // Set height size 
        var locationInputText = document.getElementById('locationInputText').offsetHeight;
        var locationAddButton = document.getElementById('locationAddButton').offsetHeight;
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
        document.getElementById("showResultForm").style.display = "none";

        // Google maps settings
        var depotInsertName = document.getElementById('depotInsertName');
        googleMapSearchBox = new google.maps.places.SearchBox(depotInsertName);
        // Set height size 
        var depotInputText = document.getElementById('depotInputText').offsetHeight;
        var depotAddButton = document.getElementById('depotAddButton').offsetHeight;
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
        document.getElementById("showResultForm").style.display = "none";

        // Set height size 
        var depotInputText = document.getElementById('vehicleInputValue').offsetHeight;
        var depotAddButton = document.getElementById('vehicleAddButton').offsetHeight;
        document.getElementById("vehiclesInfoList").style.height = mainInputFormHeight - depotInputText - depotAddButton;

        // Hide border for the mainInputForm
        document.getElementById("mainInputForm").style.border = "none";

    }

    function getAllLocationName() {
        var p = [];

        for (i = 0; i < g_DeliveryLocations.length; i++) {
            p.push(g_DeliveryLocations[i].getLocationName());
        }

        return p;
    }

    function updateLocationInfoList() {
        //read location from the class and add to the info list. The list always reflesh after some change.
        for (var i = 0; i < g_DeliveryLocations.length; i++) {
            var currentItem = "item" + (i + 1);
            var currentItemDiv = "locationInfoItem" + (i + 1);
            document.getElementById(currentItem).innerHTML = g_DeliveryLocations[i].getLocationName() + " " + g_DeliveryLocations[i].getQuantity();
            document.getElementById(currentItemDiv).style.visibility = "visible";
        }
    }

    function updateDepotInfoList() {
        var depot_name = g_DepotLocation.depot_name;
        document.getElementById("depotName").innerHTML = depot_name;
        document.getElementById("depotInfoItem").style.visibility = "visible";
    }

    function updateVehicleInfoList() {
        for (var i = 0; i < g_Vehicles.length; i++) {
            var currentItem = "vehicleItem" + (i + 1);
            var currentItemDiv = "vehicleInfoItem" + (i + 1);
            document.getElementById(currentItem).innerHTML = g_Vehicles[i].getVehicleName() + " " + g_Vehicles[i].getVehicleCapacity();
            document.getElementById(currentItemDiv).style.visibility = "visible";
        }
    }

    function deleteRouteFromMap() {
        for (var i = 0; i < g_currentDirections.length; i++) {
            g_currentDirections[i].setMap(null);
        }
    }

    // Delete marker from the array
    function deleteMapMarker(index) {
        g_DeliveryLocationsMarkers[index].setMap(null);
    }

    function addDepotMarker() {

        var infowindow = new google.maps.InfoWindow({
            content: '<div id="namePlace">' + g_DepotLocation.depot_name + '</div>'
        });

        var latlng = {
            lat: parseFloat(g_DepotLocation.lat),
            lng: parseFloat(g_DepotLocation.lng)
        };
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
        g_DepotMarker.setMap(null);
    }

    function cleanVehicleInputField() {
        document.getElementById("vehicleInsertName").value = "";
        document.getElementById("vehicleInsertCapacity").value = "";
    }

    function renderDirections(result, color) {

        var directionsDisplay = new google.maps.DirectionsRenderer({
            polylineOptions: {
                strokeColor: color,

            }
        });
        directionsDisplay.setDirections(result);
        directionsDisplay.setOptions({
            suppressMarkers: true
        });
        directionsDisplay.setMap(map);
        g_currentDirections.push(directionsDisplay);

    }

    function requestDirections(start, end, waypts, color) {
        var directionsService = new google.maps.DirectionsService;
        directionsService.route({
            origin: start,
            destination: end,
            waypoints: waypts,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, function(result) {
            renderDirections(result, color);
        });
    }

    function drawRoute(data) {

        deleteRouteFromMap();

        var routeColor = ["#0094ff", "#479f67", "#3c9a94", "#a17b4b",
            "#4ad98a", "#50cfe1", "#8ad3a4", "#40cbf1",
            "#5ecf98", "#17c31f"
        ];

        var depot = g_DepotLocation['depot_name'];

        for (var i = 0; i < data.length; i++) {
            var waypts = [];
            for (var j = 0; j < data[i].length - 1; j++) {

                waypts.push({
                    location: data[i][j],
                    stopover: true
                });

            }
            requestDirections(depot, depot, waypts, routeColor[i]);
        }
    }

    function prepareDataForDraw(data) {
        var json_data = JSON.parse(data);

        for (var i = 0; i < json_data.length; i++) {
            if (json_data[i].length == 1) {
                json_data.splice(i, 1);
                i--;
            }
        }

        for (var i = 0; i < json_data.length; i++) {
            for (var j = 0; j < json_data[i].length - 1; j++) {

                json_data[i][j] = g_DeliveryLocations[json_data[i][j]].getLocationName();
            }
        }
        drawRoute(json_data);
    }

    $scope.changeMethod = function(method) {
        g_Method = method;
        document.getElementById("chooseMethod").textContent = g_Method;
    }

    $scope.deleteDepotLocation = function() {
        g_DepotLocation = null;
        deleteDepotMarker();
        deleteRouteFromMap();
        document.getElementById("depotInfoItem").style.visibility = "hidden";
    }

    // Delete selected location from the array
    $scope.deleteItem = function(index) {
        deleteMapMarker(index);
        g_DeliveryLocationsMarkers.splice(index, 1);
        g_DeliveryLocations.splice(index, 1);
        hiddenLocationInfoList();
        updateLocationInfoList();
        console.log(g_DeliveryLocations);

    }

    // Delete selected vehicle from the array
    $scope.deleteVehicleItem = function(index) {
        g_Vehicles.splice(index, 1);
        deleteRouteFromMap();
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

    function isNumeric(num) {
        return !isNaN(num)
    }

    function isEmpty(str) {
        return (!str || 0 === str.length);
    }

    function clearInputDeliveryFields() {
        document.getElementById('locationInsertName').value = "";
        document.getElementById('locationInsertQuantity').value = "";
    }

    function inArray(needle, haystack) {
        for (var i = 0; i < haystack.length; i++) {
            if (haystack[i].getLocationName() === needle) {
                return true;
            }
        }
        return false;
    }

    function putDataToResultInfoList(response) {
        var data = JSON.parse(response);

        for (var i = 0; i < data.length; i++) {
            if (data[i].length == 0) {
                continue;
            }
            var item = [];
            item.push(g_Vehicles[i].getVehicleName());
            for (var j = 0; j < data[i].length; j++) {

                if (j == data[i].length - 1) {
                    item.push(data[i][j]);
                } else {
                    item.push(g_DeliveryLocations[data[i][j]].getLocationName());
                }
            }
            g_Result.push(item);
        }
        document.getElementById('idresult').click();

    }

    $scope.showResult = function() {

        if (g_Result.length == 0) {
            alert("Result can not be found. Please insert data and press start.");
            return;
        }

        document.getElementById("nodata").style.display = "none";
        document.getElementById("addDepotLocation").style.display = "none";
        document.getElementById("addDeliveryLocation").style.display = "none";
        document.getElementById("addVehicles").style.display = "none";
        document.getElementById("showResultForm").style.display = "block";
        document.getElementById("resultList").style.height = mainInputFormHeight;

        var parent = document.getElementById("resultListContent");

        while (parent.firstChild) {

            parent.removeChild(parent.firstChild);
        }

        for (var i = 0; i < g_Result.length; i++) {
            var loc = 0;
            var item = document.createElement("span");
            item.textContent = "Vehicle name: " + g_Result[i][0];
            parent.appendChild(item);
            parent.appendChild(document.createElement("br"));
            for (var j = 1; j < g_Result[i].length; j++) {
                if (j == g_Result[i].length - 1) {
                    var item1 = document.createElement("span");
                    item1.textContent = "   - " + g_DepotLocation['depot_name'];
                    parent.appendChild(item1);
                    parent.appendChild(document.createElement("br"));

                    var item = document.createElement("span");
                    item.textContent = "Total kilometers: " + g_Result[i][j].toFixed(1) + "km";
                    parent.appendChild(item);
                    parent.appendChild(document.createElement("br"));
                } else {
                    if (loc == 0) {
                        var item = document.createElement("span");
                        item.textContent = "Route:";
                        parent.appendChild(item);
                        parent.appendChild(document.createElement("br"));
                        var item1 = document.createElement("span");
                        item1.textContent = "   - " + g_DepotLocation['depot_name'];
                        parent.appendChild(item1);
                        parent.appendChild(document.createElement("br"));
                    }
                    var item2 = document.createElement("span");
                    item2.textContent = " - " + g_Result[i][j];
                    parent.appendChild(item2);
                    parent.appendChild(document.createElement("br"));
                    loc = 1;
                }

            }
            parent.appendChild(document.createElement("br"));
        }
    }

    // Add delivery location to the global array g_DeliveryLocations
    $scope.addDeliveryLocationAndGoodsToArray = function() {

        if (g_DeliveryLocations.length == 10) {
            alert("Maximum number of instance is 10.");
            clearInputDeliveryFields();
            return;
        }

        var places = googleMapSearchBox.getPlaces();
        var quantity = document.getElementById("locationInsertQuantity").value;

        try {

            var location_name = places[0].formatted_address;
            var lat = places[0].geometry.location.lat();
            var lng = places[0].geometry.location.lng();

        } catch (err) {
            alert("Please insert correct data. Place is not correct.");
            clearInputDeliveryFields();
            return;
        }

        if (isEmpty(quantity)) {
            alert("Please insert correct data. Quantity is not correct.");
            clearInputDeliveryFields();
            return;
        }

        if (!isNumeric(quantity)) {
            alert("Quantity must be a number.");
            clearInputDeliveryFields();
            return;
        }

        if (quantity <= 0) {
            alert("Quantity must be greader than 0.");
            clearInputDeliveryFields();
            return;
        }

        if (g_DepotLocation != null && g_DepotLocation['depot_name'] == location_name) {
            alert("Location name is already as depot name. It is not allowed.");
            document.getElementById('locationInsertName').value = "";
            document.getElementById('locationInsertQuantity').value = "";
            return;

        }

        if (inArray(location_name, g_DeliveryLocations)) {
            alert("Location name is already added. It can not be added it again.");
            document.getElementById('locationInsertName').value = "";
            document.getElementById('locationInsertQuantity').value = "";
            return;
        }

        g_DeliveryLocations[g_DeliveryLocations.length] = new Location(location_name, lat, lng, quantity);
        console.log(g_DeliveryLocations);
        var marker_color = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
        g_DeliveryLocations[g_DeliveryLocations.length - 1].addMapMarker(map, marker_color);

        document.getElementById('locationInsertName').value = "";
        document.getElementById('locationInsertQuantity').value = "";
        updateLocationInfoList();
        places.pop();
    }

    $scope.addDepotToObject = function() {

        if (!(g_DepotLocation == null)) {
            alert("Depot has already added. Please remove that one and try again.");
            document.getElementById('depotInsertName').value = "";
            return;
        }

        var place = googleMapSearchBox.getPlaces();
        try {
            var depot_name = place[0].formatted_address;
            var lat = place[0].geometry.location.lat();
            var lng = place[0].geometry.location.lng();
        } catch (err) {
            alert("Please insert correct data. Depot is not correct.");
            document.getElementById('depotInsertName').value = "";
            return;
        }

        if (inArray(depot_name, g_DeliveryLocations)) {
            alert("Depot location is already added as delivery location. It is not allowed.");
            document.getElementById('depotInsertName').value = "";
            return;
        }

        // Add depot location in JSON format
        var depot_location = "{";
        depot_location += "\"depot_name\":\"" + depot_name + "\",";
        depot_location += "\"lat\":\"" + lat + "\",";
        depot_location += "\"lng\":\"" + lng + "\"";
        depot_location += "}";
        g_DepotLocation = JSON.parse(depot_location);

        console.log(g_DepotLocation);
        document.getElementById('depotInsertName').value = "";
        addDepotMarker();
        updateDepotInfoList();
        place.pop();
    }

    $scope.addVehicleToArray = function() {

        if (g_Vehicles.length == 10) {
            alert("Maximum number of vehicles is 10.");
            cleanVehicleInputField();
            return;
        }

        var name = document.getElementById("vehicleInsertName").value;
        var capacity = document.getElementById("vehicleInsertCapacity").value;

        if (isEmpty(name) || isEmpty(capacity)) {
            alert("Insert all required data.");
            cleanVehicleInputField();
            return;
        }

        if (!isNumeric(capacity)) {
            alert("Capacity must be a number.");
            cleanVehicleInputField();
            return;
        }

        if (capacity <= 0) {
            alert("Capacity must be greader than 0.");
            cleanVehicleInputField();
            return;
        }

        g_Vehicles[g_Vehicles.length] = new Vehicles(g_Vehicles.length, name, capacity);

        cleanVehicleInputField();
        updateVehicleInfoList();
    }

    function distanceMatrixBetweenLocations(gmResponse) {

        try {
            var distanceBetweenLocations = [];
            var numberOfLocations = gmResponse['rows'].length;

            for (var i = 0; i < numberOfLocations; i++) {
                var row = [];
                for (var j = 0; j < numberOfLocations; j++) {
                    var km = gmResponse['rows'][i]['elements'][j]['distance']['value'];
                    row.push(km / 1000.0);
                }

                distanceBetweenLocations.push(row);
            }
            //console.log(distanceBetweenLocations);

            return distanceBetweenLocations;
        } catch (err) {
            alert("Delivery locations are not valid.");
            return -1;
        }
    }

    function distanceDepotArrayBetweenLocations(gmResponse) {

        try {
            var distanceDepotFromLocations = [];
            var numberOfLocations = gmResponse['rows'][0]['elements'].length;

            for (var i = 0; i < numberOfLocations; i++) {
                var km = gmResponse['rows'][0]['elements'][i]['distance']['value'];
                distanceDepotFromLocations.push(km / 1000.0);
            }

            return distanceDepotFromLocations;
        } catch (err) {
            alert("Depot location is not valid.");
            return -1;
        }
    }

    function sumVehicleCapacity() {
        var capacity = 0;

        for (var i = 0; i < g_Vehicles.length; i++) {
            capacity += parseFloat(g_Vehicles[i]['vehicle_capacity']);
        }
        return capacity;
    }

    function sumLocationQuantity() {
        var quantity = 0;

        for (var i = 0; i < g_DeliveryLocations.length; i++) {
            quantity += parseFloat(g_DeliveryLocations[i].getQuantity());
        }
        return quantity;
    }

    $scope.calculeteTheBestRoutes = function() {

        try {
            if (g_DeliveryLocations.length == 0) {
                throw "Insert delivery locations.";
            }

            if (g_DepotLocation == null) {
                throw "Insert depot location."
            }

            if (g_Vehicles.length == 0) {
                throw "Insert vehicles."
            }

            var totalVehicleCapacity = sumVehicleCapacity();
            var totalLocationQuantity = sumLocationQuantity();

            if (totalLocationQuantity > totalVehicleCapacity) {
                throw "There is not enough spaces in the vehicles. Please add vehicles.";
            }

        } catch (err) {
            alert(err);
            return;
        }

        var locations = [];

        for (var i = 0; i < g_DeliveryLocations.length; i++) {
            //console.log(g_DeliveryLocations[i].getLocationName() + g_DeliveryLocations[i].getLatitude() + g_DeliveryLocations[i].getLongitude());
            var obj = {
                "lat": g_DeliveryLocations[i].getLatitude(),
                "lng": g_DeliveryLocations[i].getLongitude()
            };
            locations.push(obj);
        }

        var depot = [];
        var obj = {
            "lat": parseFloat(g_DepotLocation['lat']),
            "lng": parseFloat(g_DepotLocation['lng'])
        };
        depot.push(obj);

        var goodsPerLocations = [];
        for (var i = 0; i < g_DeliveryLocations.length; i++) {
            goodsPerLocations.push(g_DeliveryLocations[i].getQuantity());
        }

        var strVehicles = "{\"vehicles\":[";
        for (i = 0; i < g_Vehicles.length; i++) {
            var id = "\"id\":" + "\"" + g_Vehicles[i].getVehicleId() + "\"";
            var capacity = "\"capacity\":" + "\"" + g_Vehicles[i].getVehicleCapacity() + "\"";
            strVehicles += "{" + id + "," + capacity + "}";
            if (i < (g_Vehicles.length - 1)) {
                strVehicles += ",";
            }
        }
        strVehicles += "]}";
        var v = [];
        for (i = 0; i < g_Vehicles.length; i++) {
            v.push(g_Vehicles[i].getVehicleCapacity());
        }

        g_Result = [];

        var service = new google.maps.DistanceMatrixService;
        // call for matrix locations
        service.getDistanceMatrix({
            origins: locations,
            destinations: locations,
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
        }, function(gmResponse, gmStatus) {
            if (gmStatus !== 'OK') {
                alert("locations " + gmStatus);
            } else {

                //setTimeout(function(){

                var distanceBetweenLocations = distanceMatrixBetweenLocations(gmResponse);
                if (distanceBetweenLocations == -1) {
                    return;
                }
                //call for depot distance
                service.getDistanceMatrix({
                    origins: depot,
                    destinations: locations,
                    travelMode: 'DRIVING',
                    unitSystem: google.maps.UnitSystem.METRIC,
                }, function(gmResponse, gmStatus) {
                    if (gmStatus !== 'OK') {
                        alert("depot " + gmStatus);
                    } else {

                        var distanceDepotFromLocations = distanceDepotArrayBetweenLocations(gmResponse);
                        if (distanceDepotFromLocations == -1) {
                            return;
                        }

                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                // Response from vrp server
                                console.log("Response from VRP server");
                                var response = this.responseText;
                                console.log(response);
                                document.getElementById("mainDivLoader").style.display = "none";

                                if (response == -1) {
                                    alert("Solution could not be found.\nPlease check:\n1. Vehicle capacity\n2. Network conection");
                                    return;
                                } else {
                                    prepareDataForDraw(response);
                                    putDataToResultInfoList(response);
                                }
                            }
                        }
                        if ((g_DeliveryLocations.length > 5 && g_Method == "BF") || g_Method == "SA") {
                            document.getElementById("mainDivLoader").style.display = "block";
                        }

                        xmlhttp.open("POST", "server/main.php?l=" + JSON.stringify(distanceBetweenLocations) + "&d=" + JSON.stringify(distanceDepotFromLocations) + "&v=" + JSON.stringify(v) + "&g=" + JSON.stringify(goodsPerLocations) + "&m=" + g_Method, true);
                        xmlhttp.send();
                    }
                });
                //}, 3000);
            }
        });
    }
})
