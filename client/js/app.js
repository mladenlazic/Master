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

// Method: brute force or simulated annealing
var g_Method = "BF";

// Data for showing results
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

    function hiddenVehicleInfoList() {
        for (var i = 0; i < 10; i++) {
            var id = "vehicleInfoItem" + (i + 1);
            document.getElementById(id).style.visibility = "hidden";
        }
    }

    // hiddenLocationInfoList();
    //hiddenVehicleInfoList();
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
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Vlasenica, Bosnia and Herzegovina", 44.17997740000001, 18.94181960000003, 5);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Ugljevik, Bosnia and Herzegovina", 44.6939722, 18.995954900000015, 10);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Belgrade, Serbia", 44.786568, 20.44892159999995, 10);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Novi Sad, Serbia", 45.2671352, 19.83354959999997, 5);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location(" Valjevo, Serbia", 44.2743141, 19.890339799999992, 20);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Kneza Miloša, Beograd, Serbia", 44.80833010000001, 20.463559600000053, 5);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Ruzveltova, Beograd, Serbia", 44.8068906, 20.48032330000001, 20);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Pariska, Beograd, Serbia", 44.81969899999999, 20.452750299999934, 20);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Studentski trg, Beograd, Serbia", 44.8189483, 20.457383899999968, 10);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Jurija Gagarina 115, Beograd, Serbia", 44.8019511, 20.3918132, 5);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Cara Nikolaja II, Beograd, Serbia", 44.79799680000001, 20.479631499999982, 5);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Rade Končara, Beograd, Serbia", 44.7900054, 20.477248099999997, 10);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Ustanička, Beograd, Serbia", 44.78385670000001, 20.487746799999968, 5);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Vlasenica, Bosnia and Herzegovina", 44.17997740000001, 18.94181960000003, 5);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Ugljevik, Bosnia and Herzegovina", 44.6939722, 18.995954900000015, 10);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Belgrade, Serbia", 44.786568, 20.44892159999995, 10);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Novi Sad, Serbia", 45.2671352, 19.83354959999997, 5);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Valjevo, Serbia", 44.2743141, 19.890339799999992, 20);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Kneza Miloša, Beograd, Serbia", 44.80833010000001, 20.463559600000053, 5);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Ruzveltova, Beograd, Serbia", 44.8068906, 20.48032330000001, 20);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Pariska, Beograd, Serbia", 44.81969899999999, 20.452750299999934, 20);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Studentski trg, Beograd, Serbia", 44.8189483, 20.457383899999968, 10);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Jurija Gagarina 115, Beograd, Serbia", 44.8019511, 20.3918132, 5);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Cara Nikolaja II, Beograd, Serbia", 44.79799680000001, 20.479631499999982, 5);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Rade Končara, Beograd, Serbia", 44.7900054, 20.477248099999997, 10);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Cara Nikolaja II, Beograd, Serbia", 44.79799680000001, 20.479631499999982, 5);
    // g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Rade Končara, Beograd, Serbia", 44.7900054, 20.477248099999997, 10);

    // g_DepotLocation = JSON.parse('{"depot_name":  "Bijeljina, Bosnia and Herzegovina", "lat": "44.75695109999999", "lng": "19.215022399999953"}');
    // g_Vehicles[g_Vehicles.length] = new Vehicles(0, "Mercedes", 50);
    // g_Vehicles[g_Vehicles.length] = new Vehicles(1, "Fiat", 50);
    // g_Vehicles[g_Vehicles.length] = new Vehicles(2, "Toyota", 1000);

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
        var parent = document.getElementById("deliveryLocationsInfoListContent");

        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        //read location from the class and add to the info list. The list always reflesh after some change.
        for (var i = 0; i < g_DeliveryLocations.length; i++) {
            createNewDeliveryItemInList(i, g_DeliveryLocations[i].getLocationName(), g_DeliveryLocations[i].getQuantity());
        }
    }

    function updateDepotInfoList() {
        var depot_name = g_DepotLocation.depot_name;
        document.getElementById("depotName").innerHTML = depot_name;
        document.getElementById("depotInfoItem").style.visibility = "visible";
    }

    function updateVehicleInfoList() {

        var parent = document.getElementById("vehiclesInfoListContent");

        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }

        for (var i = 0; i < g_Vehicles.length; i++) {
            createNewVehicleItemInList(i, g_Vehicles[i].getVehicleName(), g_Vehicles[i].getVehicleCapacity());
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
    function deleteItem(index) {
        deleteMapMarker(index);
        deleteRouteFromMap();
        g_DeliveryLocationsMarkers.splice(index, 1);
        g_DeliveryLocations.splice(index, 1);
        updateLocationInfoList();
    }

    // Delete selected vehicle from the array
    function deleteVehicleItem(index) {
        g_Vehicles.splice(index, 1);
        deleteRouteFromMap();
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

    function createNewVehicleItemInList(index, name, capacity) {

        $("#vehiclesInfoListContent").append('<div class="row itemlistinfo">\
                                           <div class="col-lg-11 divplistinfo">\
                                           <p class="plistinfo" id="vehicleInfo' + index + '"></p>\
                                           </div>\
                                           <div class="col-lg-1 divbtnlistinfo">\
                                           <button class="buttonlistinfo" id="v' + index + '">X</button>\
                                           </div>\
                                           </div>');

        var vname = "v" + index;
        console.log(vname);
        var button = document.getElementById(vname);
        var itemID = vname[vname.length - 1];
        button.onclick = function() {
            deleteVehicleItem(itemID)
        };

        var pname = "vehicleInfo" + index;
        var p = document.getElementById(pname);
        p.innerHTML = name + " " + capacity;
    }

    function createNewDeliveryItemInList(index, name, quantity) {

        $("#deliveryLocationsInfoListContent").append('<div class="row itemlistinfo">\
                                           <div class="col-lg-11 divplistinfo">\
                                           <p class="plistinfo" id = "locationInfo' + index + '"></p>\
                                           </div>\
                                           <div class="col-lg-1 divbtnlistinfo">\
                                           <button class="buttonlistinfo" id="' + index + '">X</button>\
                                           </div>\
                                           </div>');

        var button = document.getElementById(index);
        button.onclick = function() {
            deleteItem(button.id)
        };

        var pname = "locationInfo" + index;
        var p = document.getElementById(pname);
        p.innerHTML = name + " " + quantity;
    }

    // Add delivery location to the global array g_DeliveryLocations
    $scope.addDeliveryLocationAndGoodsToArray = function() {

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

    function distanceMatrixBetweenLocations(response) {

        try {
            var r = response['rows'].length;
            var c = response['rows'][0]['elements'].length;
            var distanceBetweenLocations = [];
            for (var i = 0; i < r; i++) {
                var row = [];
                for (var j = 0; j < c; j++) {
                    var km = response['rows'][i]['elements'][j]['distance']['value'];
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

    function distanceDepotArrayBetweenLocations(response) {

        try {
            var distanceDepotFromLocations = [];
            var numberOfLocations = response['rows'][0]['elements'].length;

            for (var i = 0; i < numberOfLocations; i++) {
                var km = response['rows'][0]['elements'][i]['distance']['value'];
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

    var g_NumberOfRequest;
    var g_MatrixBetweenLocations = [];
    var g_MatrixBetweenLocationsAndDepot = [];
    var g_ArrayOfDeliveryLocationsSubMatrix = [];

    function updateDeliveryLocationMatrix(gMat, k, l) {
        for (var i = 0; i < gMat.length; i++) {
            for (var j = 0; j < gMat[0].length; j++) {
                g_MatrixBetweenLocations[i + k][j + l] = gMat[i][j];
            }
        }
    }

    function convertDeliveryLocationForGoogleMapApi() {
        var locations = [];
        for (var i = 0; i < g_DeliveryLocations.length; i++) {
            var obj = {
                "lat": g_DeliveryLocations[i].getLatitude(),
                "lng": g_DeliveryLocations[i].getLongitude()
            };
            locations.push(obj);
        }
        return locations;
    }

    function sendDataToServer() {

        //GOODS PER LOCARIONS
        var goodsPerLocations = [];
        for (var i = 0; i < g_DeliveryLocations.length; i++) {
            goodsPerLocations.push(g_DeliveryLocations[i].getQuantity());
        }

        // VEHICLES
        var vehicles = [];
        for (i = 0; i < g_Vehicles.length; i++) {
            vehicles.push(g_Vehicles[i].getVehicleCapacity());
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
                    alert("Solution could not be found.\nPlease check:\n1. Vehicle capacity\n2. Network connection");
                    return;
                } else {
                    prepareDataForDraw(response);
                    putDataToResultInfoList(response);
                }
            }
        }

        xmlhttp.open("POST", "server/main.php?l=" + JSON.stringify(g_MatrixBetweenLocations) + "&d=" + JSON.stringify(g_MatrixBetweenLocationsAndDepot) + "&v=" + JSON.stringify(vehicles) + "&g=" + JSON.stringify(goodsPerLocations) + "&m=" + g_Method, true);
        xmlhttp.send();
        console.log("DATA IS SENT TO SERVER");
    }

    function createDepotLocationMatrix(splitedLocations, depot, current, numberOfDepotRequest) {

        if (current == numberOfDepotRequest) {
            console.log("CANCULATING IS DONE");

            var newArr = [];
            for (var i = 0; i < g_MatrixBetweenLocationsAndDepot.length; i++) {
                newArr = newArr.concat(g_MatrixBetweenLocationsAndDepot[i]);
            }
            g_MatrixBetweenLocationsAndDepot = newArr;

            sendDataToServer();
        } else {
            var service = new google.maps.DistanceMatrixService;
            service.getDistanceMatrix({
                origins: depot,
                destinations: splitedLocations[current],
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem.METRIC,
            }, function(response, status) {
                if (status !== 'OK') {
                    if (status == "OVER_QUERY_LIMIT") {
                        console.log("DEPOT: OVER_QUERY_LIMIT");
                        setTimeout(function() {
                            createDepotLocationMatrix(splitedLocations, depot, current, numberOfDepotRequest);
                        }, 1000);
                    } else {
                        alert("DEPOT LOCATION REQUEST: " + status);
                    }
                } else {
                    g_MatrixBetweenLocationsAndDepot.push(distanceDepotArrayBetweenLocations(response));
                    createDepotLocationMatrix(splitedLocations, depot, current + 1, numberOfDepotRequest);
                }
            });
        }
    }

    function prepereDepotDataToServer(locations, depot) {

        var splitedLocations = [];
        var numberOfDepotRequest = 1;
        var step = 25;
        if (locations.length > step) {
            numberOfDepotRequest = Math.ceil(locations.length / step);

            for (var i = 0; i < numberOfDepotRequest; i++) {
                var first = i * step;
                var second = i * step + step;
                if (second > locations.length) {
                    second = locations.length;
                }
                splitedLocations.push(locations.slice(first, second));
            }
        } else {
            splitedLocations.push(locations);
        }

        createDepotLocationMatrix(splitedLocations, depot, 0, numberOfDepotRequest);
    }

    function createDeliveryLocationMatrix(locationsInGroup, current, numberOfDeliveryRequest) {
        if (current == numberOfDeliveryRequest) {
            var l = 0;
            for (var i = 0; i < g_ArrayOfDeliveryLocationsSubMatrix.length; i++) {
                var k = Math.floor(i / g_NumberOfRequest);
                if (l == g_NumberOfRequest) {
                    l = 0;
                }
                updateDeliveryLocationMatrix(g_ArrayOfDeliveryLocationsSubMatrix[i], k * 10, l * 10);
                l++;
            }

            var locations = convertDeliveryLocationForGoogleMapApi();

            // Depot location
            var depot = [];
            var obj = {
                "lat": parseFloat(g_DepotLocation['lat']),
                "lng": parseFloat(g_DepotLocation['lng'])
            };
            depot.push(obj);

            prepereDepotDataToServer(locations, depot);

        } else {
            var service = new google.maps.DistanceMatrixService;
            service.getDistanceMatrix({
                origins: locationsInGroup[current],
                destinations: locationsInGroup[current + 1],
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem.METRIC,
            }, function(response, status) {
                if (status !== 'OK') {
                    if (status == "OVER_QUERY_LIMIT") {
                        console.log("DELIVERY: OVER_QUERY_LIMIT");
                        setTimeout(function() {
                            createDeliveryLocationMatrix(locationsInGroup, current, numberOfDeliveryRequest);
                        }, 3000);
                    } else {
                        alert("DELIVERY LOCATION REQUEST: " + status);
                    }
                } else {
                    g_ArrayOfDeliveryLocationsSubMatrix.push(distanceMatrixBetweenLocations(response));

                    if (locationsInGroup.length > 2) {
                        setTimeout(function() {
                            createDeliveryLocationMatrix(locationsInGroup, current + 2, numberOfDeliveryRequest);
                        }, 3000);
                    } else {
                        createDeliveryLocationMatrix(locationsInGroup, current + 2, numberOfDeliveryRequest);
                    }
                }
            });
        }
    }

    function prepareLocationDataToServer() {

        // Show loader
        document.getElementById("mainDivLoader").style.display = "block";

        // Reset global variables
        g_Result = [];
        g_MatrixBetweenLocations = [];
        g_MatrixBetweenLocationsAndDepot = [];
        g_ArrayOfDeliveryLocationsSubMatrix = [];

        var locations = convertDeliveryLocationForGoogleMapApi();

        var locationsInGroup = [];

        for (var i = 0; i < locations.length; i++) {
            var tmp = [];
            for (var j = 0; j < locations.length; j++) {
                tmp.push(0);
            }
            g_MatrixBetweenLocations.push(tmp);
        }

        g_NumberOfRequest = Math.ceil(locations.length / 10);
        var step = 10;
        for (i = 0; i < g_NumberOfRequest; i++) { //3
            var firstIndexI = i * step;
            var secondIndexI = ((i + 1) * step);
            if (secondIndexI > locations.length) {
                secondIndexI = locations.length;
            }
            var sublocation1 = locations.slice(firstIndexI, secondIndexI);

            for (j = 0; j < g_NumberOfRequest; j++) {
                var firstIndexJ = j * step;
                var secondIndexJ = ((j + 1) * step);
                if (secondIndexJ > locations.length) {
                    secondIndexJ = locations.length;
                }
                var sublocation2 = locations.slice(firstIndexJ, secondIndexJ);
                locationsInGroup.push(sublocation1);
                locationsInGroup.push(sublocation2);
            }
        }

        createDeliveryLocationMatrix(locationsInGroup, 0, g_NumberOfRequest * g_NumberOfRequest * 2);

    }

    $scope.start = function() {

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

            prepareLocationDataToServer();
        } catch (err) {
            alert(err);
            return;
        }
    }
})
