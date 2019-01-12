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

var g_UseTestExample = 0;

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

    function addTestDeliveryLocation(x) {

        setUpDeliveryLocationDesignSettings();

        if (x == 5 || x == 10 || x == 15 || x == 25 || x == 50) {
            g_UseTestExample = 5;
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Stjepana Ljubiše, Beograd, Serbia", 44.8073777, 20.483595700000023, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Prilaz, Beograd, Serbia", 44.84125299999999, 20.400103899999976, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Birčaninova, Beograd, Serbia", 44.8031462, 20.461751800000002, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Gandijeva, Beograd, Serbia", 44.8076454, 20.38473929999998, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Mije Kovačevića, Beograd, Serbia", 44.8124612, 20.48856849999993, 20);


        }
        if (x == 10 || x == 15 || x == 25 || x == 50) {
            g_UseTestExample = 10;
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Vojvode Stepe, Beograd, Serbia", 44.7609797, 20.484824200000048, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Đorđa Stanojevića, Beograd, Serbia", 44.8076298, 20.406594900000073, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Nehruova, Beograd, Serbia", 44.8010286, 20.38146089999998, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Bulevar kralja Aleksandra, Beograd, Serbia", 44.7879673, 20.516884000000005, 20);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Bulevar Mihajla Pupina, Beograd, Serbia", 44.8209833, 20.42021239999997, 10);
        }
        if (x == 15 || x == 25 || x == 50) {
            g_UseTestExample = 15;
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Kneza Danila 23, Beograd, Serbia", 44.81075630000001, 20.47658960000001, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Dalmatinska, Beograd, Serbia", 44.81128969999999, 20.47789750000004, 20);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Španskih boraca, Beograd, Serbia", 44.8148853, 20.419678699999963, 20);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Resavska, Beograd, Serbia", 44.80470870000001, 20.462097800000038, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Beogradska, Beograd, Serbia", 44.80561639999999, 20.469803800000022, 5);
        }
        if (x == 25 || x == 50) {
            g_UseTestExample = 25;
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Kneza Miloša, Beograd, Serbia", 44.80833010000001, 20.463559600000053, 30);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Kralja Milana, Beograd, Serbia", 44.8067686, 20.464405400000032, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Nemanjina, Beograd, Serbia", 44.8025943, 20.4658905, 25);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Cvijićeva, Beograd, Serbia", 44.81230970000001, 20.47841310000001, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Mozerova, Beograd, Serbia", 44.83795509999999, 20.389651400000048, 20);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Dimitrija Tucovića, Beograd, Serbia", 44.8070204, 20.482852999999977, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Mije Kovačevića, Beograd, Serbia", 44.8124612, 20.48856849999993, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Starine Novaka, Beograd, Serbia", 44.8101142, 20.476716500000066, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Mirijevo, Belgrade, Serbia", 44.7854051, 20.54615469999999, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Karaburma, Belgrade, Serbia", 44.8172662, 20.50955799999997, 10);
        }
        if (x == 50) {
            g_UseTestExample = 50;
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Francuska, Beograd, Serbia", 44.81837669999999, 20.463725899999986, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Kapetan-Mišina, Beograd, Serbia", 44.8219103, 20.461915500000032, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Visokog Stevana, Beograd, Serbia", 44.8252236, 20.459705100000065, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Kneginje Zorke, Beograd, Serbia", 44.8022677, 20.47119440000006, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Kneginje Ljubice, Beograd, Serbia", 44.8213939, 20.463648899999953, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Svetogorska, Beograd, Serbia", 44.8141223, 20.467663399999992, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Svetozara Markovića, Beograd, Serbia", 44.80471439999999, 20.46517659999995, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Zeleni Venac, Belgrade, Serbia", 44.8120378, 20.45822279999993, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Savska, Beograd, Serbia", 44.8044885, 20.453331299999945, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Narodnih heroja, Beograd, Serbia", 44.82158039999999, 20.404714300000023, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Tošin bunar, Beograd, Serbia", 44.8299484, 20.399313500000062, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Ugrinovačka, Beograd, Serbia", 44.8460312, 20.400541100000055, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Dobanovački put, Beograd, Serbia", 44.845915, 20.354593799999975, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Vojni put 2, Beograd, Serbia", 44.8430965, 20.374193800000057, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Svetog Nikole, Beograd, Serbia", 44.8047685, 20.492585200000008, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Braće Ribnikar, Beograd, Serbia", 44.8064615, 20.48447090000002, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Pop Stojanova, Beograd, Serbia", 44.7971083, 20.49021540000001, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Ustanička, Beograd, Serbia", 44.78385670000001, 20.487746799999968, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Bulevar Oslobođenja, Beograd, Serbia", 44.7558186, 20.483123200000023, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Bulevar Nikole Tesle, Beograd, Serbia", 44.8223964, 20.42695230000004, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Bulevar Zorana Đinđića, Beograd, Serbia", 44.8175329, 20.417997199999945, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Dragoslava Srejovića, Beograd, Serbia", 44.8098336, 20.511362200000008, 5);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Severni bulevar, Beograd, Serbia", 44.81037389999999, 20.493359699999928, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Crveni Krst, Belgrade, Serbia", 44.79585599999999, 20.488229199999978, 10);
            g_DeliveryLocations[g_DeliveryLocations.length] = new Location("Bulevar despota Stefana, Beograd, Serbia", 44.8172371, 20.477729700000054, 10);
        }

        updateLocationInfoList();

        var marker_color = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
        for (var i = 0; i < g_DeliveryLocations.length; i++) {
            g_DeliveryLocations[i].addMapMarker(map, marker_color);
        }
    }

    function addTestDepotLocation() {
        g_DepotLocation = JSON.parse('{"depot_name":  "Ušće, Beograd, Serbia", "lat": "44.81897360000001", "lng": "20.438372699999945"}');
        addDepotMarker();
        updateDepotInfoList();

    }

    function addTestVehicles(x) {

        if (x == 5 || x == 10 || x == 15 || x == 25 || x == 50) {
            g_Vehicles[g_Vehicles.length] = new Vehicles(0, "BMW", 20);
            g_Vehicles[g_Vehicles.length] = new Vehicles(1, "Fiat", 50);
        }
        if (x == 10 || x == 15 || x == 25 || x == 50) {
            g_Vehicles[g_Vehicles.length] = new Vehicles(2, "Mercedes", 50);
        }
        if (x == 15 || x == 25 || x == 50) {
            g_Vehicles[g_Vehicles.length] = new Vehicles(3, "Ford", 80);
        }
        if (x == 25 || x == 50) {
            g_Vehicles[g_Vehicles.length] = new Vehicles(4, "Opel", 150);
        }
        if (x == 50) {
            g_Vehicles[g_Vehicles.length] = new Vehicles(5, "Subaru", 250);
        }
        updateVehicleInfoList();        
    }

    $scope.TEST_X_INSTANCE = function(x) {
        
        // Delete delivery markers if thare are
        for (var i = 0; i < g_DeliveryLocations.length; i++) {
            deleteMapMarker(i);
        }

        g_Vehicles = [];
        g_DepotLocation = [];
        g_DeliveryLocations = [];
        g_DeliveryLocationsMarkers = [];

        addTestDeliveryLocation(x);
        addTestDepotLocation();
        addTestVehicles(x);
    }
    
    var googleMapSearchBox;
    var map = new google.maps.Map(document.getElementById('googleMapContent'), {
        zoom: 12,
        center: {
            lat: 44.787197,
            lng: 20.457273
        }
    });

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
        document.getElementById("locationInsertName").placeholder = "Enter location name...";
        document.getElementById("locationInsertQuantity").placeholder = "Enter quantity of goods...";

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
            icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
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

    function drawRoute(index, data=g_Result) {

        deleteRouteFromMap();

        var routeColor = ["#0094ff", "#479f67", "#3c9a94", "#a17b4b",
            "#4ad98a", "#50cfe1", "#8ad3a4", "#40cbf1",
            "#5ecf98", "#17c31f"
        ];

        var depot = g_DepotLocation['depot_name'];

        for (var i = 0; i < data.length; i++) {
            var waypts = [];
            for (var j = 1; j < data[i].length - 2; j++) {

                waypts.push({
                    location: data[i][j]
                });

            }

            requestDirections(depot, depot, waypts, routeColor[i + parseInt(index)]);
        }
    }

    $scope.changeMethod = function(method) {
        g_Method = method;
        document.getElementById("chooseMethod").textContent = g_Method;
    }

    $scope.deleteDepotLocation = function() {
        g_UseTestExample = 0;
        g_DepotLocation = null;
        deleteDepotMarker();
        deleteRouteFromMap();
        document.getElementById("depotInfoItem").style.visibility = "hidden";
    }

    // Delete selected location from the array
    function deleteItem(index) {
        g_UseTestExample = 0;
        deleteMapMarker(index);
        deleteRouteFromMap();
        g_DeliveryLocationsMarkers.splice(index, 1);
        g_DeliveryLocations.splice(index, 1);
        updateLocationInfoList();
    }

    // Delete selected vehicle from the array
    function deleteVehicleItem(index) {
        g_UseTestExample = 0;
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
            var goods = 0;
            // dodajemo ime vozila
            item.push(i);
            for (var j = 0; j < data[i].length; j++) {

                // ako je kilometraza po vozilu samo je dodamo
                if (j == data[i].length - 1) {
                    item.push(data[i][j]);
                } else {
                    // sabiramo koliko vozilo dostavlja na tu lokaciju
                    goods += parseInt(g_DeliveryLocations[data[i][j]].getQuantity());
                    
                    // dodajemo ime lokacije
                    item.push(g_DeliveryLocations[data[i][j]].getLocationName());
                }
            }
            // dodajemo koliko vozilo vozi
            item.push(goods);

            g_Result.push(item);
        }

        document.getElementById('idresult').click();
    }

    function drawSeparateRoute(index) {
        
        var k = [];
        var t = g_Result[index].slice();
        k.push(t);
        drawRoute(index, k);
    }

    $scope.showResult = function() {

        // g_Result
        // g_Result[0] - vehicle id
        // g_Result[g_Result.lenght-1] - goods in vehicle
        // g_Result[g_Result.lenght-2] - kilometars per vehicle
        // another elements - locations per vehicles

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

        var total_kilometers = 0;
        var total_goods = 0;
        for (var i = 0; i < g_Result.length; i++) {

            var item = document.createElement("span");
            item.textContent = "Vehicle name: " + vehicles[g_Result[i][0]].getVehicleName();
            parent.appendChild(item);

            var showRoute = document.createElement("button");
            var t = document.createTextNode("route");
            showRoute.id = i;
            showRoute.onclick = function() {
                drawSeparateRoute(this.id);
            };
            showRoute.style = "float: right";
            showRoute.appendChild(t);
            parent.appendChild(showRoute);
            parent.appendChild(document.createElement("br"));

            var item1 = document.createElement("span");
            item1.textContent = "Route:";
            parent.appendChild(item1);
            parent.appendChild(document.createElement("br"));

            var item2 = document.createElement("span");
            item2.textContent = "   - " + g_DepotLocation['depot_name'];
            parent.appendChild(item2);
            parent.appendChild(document.createElement("br"));

            for (var j = 1; j < g_Result[i].length-1; j++) {
                if (j == g_Result[i].length - 2) {
                    var item3 = document.createElement("span");
                    item3.textContent = "   - " + g_DepotLocation['depot_name'];
                    parent.appendChild(item3);
                    parent.appendChild(document.createElement("br"));

                    var item4 = document.createElement("span");
                    item4.textContent = "Vehicle capacity: " + vehicles[g_Result[i][0]].getVehicleCapacity();
                    parent.appendChild(item4);
                    parent.appendChild(document.createElement("br"));

                    var item5 = document.createElement("span");
                    item5.textContent = "Goods in vehicle: " + g_Result[i][j+1];
                    parent.appendChild(item5);
                    parent.appendChild(document.createElement("br"));

                    var item6 = document.createElement("span");
                    item6.textContent = "Kilometers: " + g_Result[i][j].toFixed(1) + "km";
                    parent.appendChild(item6);
                    parent.appendChild(document.createElement("br"));

                    total_kilometers += parseFloat(g_Result[i][j]);
                    total_goods += parseFloat(g_Result[i][j+1]);
                } else {

                    var item7 = document.createElement("span");
                    item7.textContent = " - " + g_Result[i][j];
                    parent.appendChild(item7);
                    parent.appendChild(document.createElement("br"));
                }

            }
            parent.appendChild(document.createElement("br"));
        }

        var item8 = document.createElement("span");
        item8.textContent = "Total goods: " + total_goods.toFixed(0);
        parent.appendChild(item8);
        parent.appendChild(document.createElement("br"));
    
        var item9 = document.createElement("span");
        item9.textContent = "Total kilometers: " + total_kilometers.toFixed(1) + "km";
        parent.appendChild(item9);

        var resetRoute = document.createElement("button");
        var t = document.createTextNode("all route");
        resetRoute.onclick = function() {
            drawRoute(0);
        };
        resetRoute.style = "float: right";
        resetRoute.appendChild(t);
        parent.appendChild(resetRoute);


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
        
        var marker_color = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
        g_DeliveryLocations[g_DeliveryLocations.length - 1].addMapMarker(map, marker_color);

        document.getElementById('locationInsertName').value = "";
        document.getElementById('locationInsertQuantity').value = "";
        updateLocationInfoList();
        places.pop();
        //console.log(g_DeliveryLocations);
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
            return distanceBetweenLocations;
        } catch (err) {
            alert("Delivery locations are not valid.");
            return -1;
        }
    }

    var vehicles = [];
    var vehiclesCapacity = [];
    var goodsPerLocations = [];
    var matrixBetweenDeliveryLocations = [];
    var matrixBetweenLocationsAndDepot = [];

    function distanceDepotArrayBetweenLocations(response) {

        try {
            var distanceDepotFromLocations = [];
            var numberOfLocations = response['rows'][0]['elements'].length;

            for (var i = 0; i < numberOfLocations; i++) {
                var km = response['rows'][0]['elements'][i]['distance']['value'];
                matrixBetweenLocationsAndDepot.push(km / 1000.0);
            }
        } catch (err) {
            // TO DO ugasiti formu, prikazati gresku od servera, napraviti jednu funkciju za to.
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

var t0 = 0;
var t1 = 0;


    function sendDataToServer() {

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Response from vrp server
                console.log("Response from VRP server");
                var response = this.responseText;
                
                console.log(response);
                
                document.getElementById("mainDivLoader").style.display = "none";
                t1 = performance.now();
                console.log("Time execution: " + ((t1 - t0)/1000).toFixed(2) + " s.");
                console.log("Time execution: " + ((t1 - t0)/1000/60).toFixed(2) + " m.");

                if (response == -1) {
                    alert("Solution could not be found.\nPlease check:\n1. Network connection\n2. Vehicle capacity\n\nTry again!");
                    return;
                } else {
                    putDataToResultInfoList(response);
                    drawRoute(0);
                }
            }
        }

        var data = "[";
        
        if (g_UseTestExample) {
            if(g_UseTestExample == 5) {
                matrixBetweenDeliveryLocations = "[[0,11.421,2.648,11.404,1.014],[12.173,0,9.264,4.836,12.022],[2.533,8.753,0,8.736,3.304],[10.302,5.014,7.393,0,10.151],[0.743,11.705,3.034,11.688,0]]";
                matrixBetweenLocationsAndDepot = "[4.886,4.71,3.583,5.667,5.177]";
            }
            else if(g_UseTestExample == 10) {
                matrixBetweenDeliveryLocations = "[[0,11.421,2.648,11.404,1.014,7.729,8.419,10.327,3.9,6.76],[12.173,0,9.264,4.836,12.022,13.409,5.03,6.121,14.652,3.63],[2.533,8.753,0,8.736,3.304,5.726,5.751,7.659,7.114,6.617],[10.302,5.014,7.393,0,10.151,11.538,2.425,1.285,12.781,4.609],[0.743,11.705,3.034,11.688,0,7.638,8.703,10.611,4.651,7.014],[7.368,13.601,5.93,13.584,7.797,0,10.599,12.507,5.949,11.465],[10.075,4.959,7.166,2.413,9.924,11.312,0,2.655,12.555,3.077],[10.376,6.021,7.467,1.237,10.225,11.612,2.499,0,12.855,4.693],[3.713,14.271,7.923,14.254,4.507,6.039,11.27,13.177,0,12.135],[5.997,5.119,5.86,5.499,6.288,10.006,2.495,5.081,11.249,0]]";
                matrixBetweenLocationsAndDepot = "[4.886,4.71,3.583,5.667,5.177,9.464,3.729,5.909,10.707,2.431]";
            }
            else if(g_UseTestExample == 15) {
                matrixBetweenDeliveryLocations = "[[0,11.421,2.648,11.404,1.014,7.729,8.419,10.327,3.9,6.76,1.38,0.908,7.131,2.592,1.747],[12.173,0,9.264,4.836,12.022,13.409,5.03,6.121,14.652,3.63,10.86,11.127,4.931,9.321,11.424],[2.533,8.753,0,8.736,3.304,5.726,5.751,7.659,7.114,6.617,2.142,1.976,4.463,0.243,0.994],[10.302,5.014,7.393,0,10.151,11.538,2.425,1.285,12.781,4.609,8.989,9.256,4.664,7.45,9.553],[0.743,11.705,3.034,11.688,0,7.638,8.703,10.611,4.651,7.014,1.766,1.293,7.415,2.978,2.133],[7.368,13.601,5.93,13.584,7.797,0,10.599,12.507,5.949,11.465,6.996,6.811,9.311,5.874,5.83],[10.075,4.959,7.166,2.413,9.924,11.312,0,2.655,12.555,3.077,8.762,9.029,1.993,7.224,9.326],[10.376,6.021,7.467,1.237,10.225,11.612,2.499,0,12.855,4.693,9.063,9.33,4.525,7.524,9.627],[3.713,14.271,7.923,14.254,4.507,6.039,11.27,13.177,0,12.135,4.873,4.401,9.981,7.981,4.526],[5.997,5.119,5.86,5.499,6.288,10.006,2.495,5.081,11.249,0,4.946,5.44,0.917,4.45,4.877],[1.255,10.518,1.732,10.501,1.45,6.813,7.517,9.425,4.661,5.843,0,0.296,6.228,1.675,0.831],[1.285,10.513,2.215,10.496,1.48,7.296,7.512,9.419,4.691,5.822,0.472,0,6.223,2.064,1.313],[7.853,4.599,4.943,4.582,7.702,9.089,1.578,4.164,10.332,1.42,6.54,6.807,0,5.001,7.104],[2.508,8.81,0.243,8.793,3.057,5.906,5.808,7.716,7.295,4.801,1.895,1.951,4.52,0,0.97],[1.538,9.654,0.901,9.637,1.968,5.982,6.652,8.56,4.424,5.646,1.167,0.982,5.364,0.845,0]]";
                matrixBetweenLocationsAndDepot = "[4.886,4.71,3.583,5.667,5.177,9.464,3.729,5.909,10.707,2.431,3.835,4.33,2.141,3.339,3.767]";
            }
            else if(g_UseTestExample == 25) {
                matrixBetweenDeliveryLocations = "[[0,11.421,2.648,11.404,1.014,7.729,8.419,10.327,3.9,6.76,1.38,0.908,7.131,2.592,1.747,2.536,2.35,2.207,1.61,11.391,0.733,1.014,0.997,6.394,2.972],[12.173,0,9.264,4.836,12.022,13.409,5.03,6.121,14.652,3.63,10.86,11.127,4.931,9.321,11.424,9.526,7.874,11.083,11.087,1.053,9.46,12.022,10.941,17.94,11.196],[2.533,8.753,0,8.736,3.304,5.726,5.751,7.659,7.114,6.617,2.142,1.976,4.463,0.243,0.994,0.808,1.067,0.654,2.369,8.723,2.366,3.304,2.223,10.402,4.891],[10.302,5.014,7.393,0,10.151,11.538,2.425,1.285,12.781,4.609,8.989,9.256,4.664,7.45,9.553,7.655,8.165,9.212,9.216,4.554,9.738,10.151,9.07,16.069,11.738],[0.743,11.705,3.034,11.688,0,7.638,8.703,10.611,4.651,7.014,1.766,1.293,7.415,2.978,2.133,2.922,2.736,2.592,1.453,11.674,0.843,0,1.383,6.6,1.958],[7.368,13.601,5.93,13.584,7.797,0,10.599,12.507,5.949,11.465,6.996,6.811,9.311,5.874,5.83,6.088,5.902,5.489,7.384,13.571,7.201,7.797,7.077,9.582,9.666],[10.075,4.959,7.166,2.413,9.924,11.312,0,2.655,12.555,3.077,8.762,9.029,1.993,7.224,9.326,7.429,7.938,8.985,8.989,5.38,9.512,9.924,8.843,15.842,11.511],[10.376,6.021,7.467,1.237,10.225,11.612,2.499,0,12.855,4.693,9.063,9.33,4.525,7.524,9.627,7.729,8.239,9.286,9.29,5.56,9.812,10.225,9.144,16.143,11.812],[3.713,14.271,7.923,14.254,4.507,6.039,11.27,13.177,0,12.135,4.873,4.401,9.981,7.981,4.526,8.186,5.037,6.199,5.103,14.241,4.213,4.507,4.49,3.718,5.501],[5.997,5.119,5.86,5.499,6.288,10.006,2.495,5.081,11.249,0,4.946,5.44,0.917,4.45,4.877,4.059,4.245,4.753,5.353,5.486,5.83,6.288,5.027,14.537,7.566],[1.255,10.518,1.732,10.501,1.45,6.813,7.517,9.425,4.661,5.843,0,0.296,6.228,1.675,0.831,1.62,1.433,1.29,0.998,10.488,0.86,1.45,0.081,7.154,3.151],[1.285,10.513,2.215,10.496,1.48,7.296,7.512,9.419,4.691,5.822,0.472,0,6.223,2.064,1.313,1.948,1.762,1.773,0.702,10.483,1.587,1.48,0.564,7.184,3.182],[7.853,4.599,4.943,4.582,7.702,9.089,1.578,4.164,10.332,1.42,6.54,6.807,0,5.001,7.104,5.206,4.493,6.763,6.767,4.569,6.078,7.702,6.621,13.62,7.814],[2.508,8.81,0.243,8.793,3.057,5.906,5.808,7.716,7.295,4.801,1.895,1.951,4.52,0,0.97,0.561,1.042,0.629,2.122,8.78,2.341,3.057,1.976,10.582,4.644],[1.538,9.654,0.901,9.637,1.968,5.982,6.652,8.56,4.424,5.646,1.167,0.982,5.364,0.845,0,1.304,1.118,0.459,1.554,9.624,1.372,1.968,1.248,7.262,3.837],[2.647,9.303,0.727,9.286,2.495,6.217,6.302,8.21,5.136,4.985,1.334,1.6,5.013,0.483,0.985,0,0.186,0.695,1.561,9.273,2.083,2.495,1.415,10.894,4.082],[2.336,9.117,0.541,9.1,2.831,6.031,6.116,8.024,7.42,6.981,1.67,1.78,4.827,0.297,0.799,0.186,0,0.509,1.897,9.087,2.17,2.831,1.751,10.707,4.418],[2.124,9.194,0.442,9.177,2.554,5.523,6.193,8.101,6.911,5.187,1.753,1.568,4.904,0.385,0.586,0.845,0.659,0,2.507,9.164,1.958,2.554,1.834,10.199,4.423],[1.086,10.789,2.016,10.772,1.282,7.097,7.787,9.695,4.493,6.127,0.748,0.276,6.499,1.96,1.115,1.904,1.718,1.574,0,10.759,1.389,1.282,0.365,6.986,2.983],[12.178,1.056,9.269,4.181,12.027,13.415,5.924,5.467,14.658,4.283,10.865,11.132,4.936,9.327,11.429,9.531,10.041,11.088,11.092,0,11.615,12.027,10.946,17.945,13.614],[0.402,11.602,2.83,11.585,1.195,7.72,8.601,10.508,3.808,6.941,1.561,1.089,7.312,2.773,1.928,2.717,2.531,2.388,1.791,11.572,0,1.195,1.179,6.302,3.153],[0.743,11.705,3.034,11.688,0,7.638,8.703,10.611,4.651,7.014,1.766,1.293,7.415,2.978,2.133,2.922,2.736,2.592,1.453,11.674,0.843,0,1.383,6.6,1.958],[1.415,10.438,1.651,10.42,1.611,6.732,7.436,9.344,4.367,5.762,0.654,0.83,6.147,1.595,0.75,1.539,1.353,1.209,1.041,10.407,1.029,1.611,0,7.315,3.791],[6.331,18.501,12.152,18.483,6.658,10.41,15.499,17.407,4.054,16.365,7.491,7.018,14.21,12.21,7.858,12.415,7.861,10.864,7.72,18.47,6.651,6.658,7.108,0,7.148],[2.872,11.33,5.004,13.243,2.13,9.768,10.258,12.166,5.312,8.249,3.736,3.264,7.958,4.811,4.103,5.07,4.509,4.563,3.317,13.23,2.972,2.13,3.353,5.901,0]]";
                matrixBetweenLocationsAndDepot = "[4.886,4.71,3.583,5.667,5.177,9.464,3.729,5.909,10.707,2.431,3.835,4.33,2.141,3.339,3.767,2.948,3.134,3.643,4.242,6.71,4.72,5.177,3.916,13.994,6.456]";
            }
            else if(g_UseTestExample == 50) {
                matrixBetweenDeliveryLocations = "[[0,11.421,2.648,11.404,1.014,7.729,8.419,10.327,3.9,6.76,1.38,0.908,7.131,2.592,1.747,2.536,2.35,2.207,1.61,11.391,0.733,1.014,0.997,6.394,2.972,2.714,3.227,3.402,2.283,2.734,1.94,2.274,3.694,4.186,8.881,9.725,9.598,15.07,13.522,0.846,0.166,1.889,4.45,7.83,5.874,6.806,3.088,1.483,1.803,2.287],[12.173,0,9.264,4.836,12.022,13.409,5.03,6.121,14.652,3.63,10.86,11.127,4.931,9.321,11.424,9.526,7.874,11.083,11.087,1.053,9.46,12.022,10.941,17.94,11.196,7.727,8.24,8.869,11.44,8.202,7.667,8.126,7.038,8.305,3.143,1.696,0.835,3.938,2.257,12.648,12.083,12.055,12.017,13.509,5.561,4.088,13.896,12.737,12.02,11.906],[2.533,8.753,0,8.736,3.304,5.726,5.751,7.659,7.114,6.617,2.142,1.976,4.463,0.243,0.994,0.808,1.067,0.654,2.369,8.723,2.366,3.304,2.223,10.402,4.891,2.182,2.696,3.515,1.011,2.847,2.123,0.843,2.728,1.518,6.212,7.056,9.093,12.402,10.854,3.242,2.677,2.743,3.94,5.826,4.159,4.918,5.178,4.019,2.657,3.188],[10.302,5.014,7.393,0,10.151,11.538,2.425,1.285,12.781,4.609,8.989,9.256,4.664,7.45,9.553,7.655,8.165,9.212,9.216,4.554,9.738,10.151,9.07,16.069,11.738,7.863,8.377,9.006,9.569,8.338,7.804,8.263,7.175,6.434,3.081,3.318,5.354,8.015,6.467,10.777,10.212,10.184,10.146,11.639,6.476,4.217,12.025,10.866,10.149,10.035],[0.743,11.705,3.034,11.688,0,7.638,8.703,10.611,4.651,7.014,1.766,1.293,7.415,2.978,2.133,2.922,2.736,2.592,1.453,11.674,0.843,0,1.383,6.6,1.958,2.643,3.155,3.33,1.92,2.662,2.256,2.659,3.634,4.47,9.164,10.008,12.045,15.354,13.806,1.439,0.874,2.639,5.201,7.738,6.128,7.87,2.074,0.915,2.553,1.781],[7.368,13.601,5.93,13.584,7.797,0,10.599,12.507,5.949,11.465,6.996,6.811,9.311,5.874,5.83,6.088,5.902,5.489,7.384,13.571,7.201,7.797,7.077,9.582,9.666,7.384,7.967,8.563,5.846,7.895,7.589,5.905,10.501,6.966,11.061,11.905,13.941,17.25,15.702,7.149,7.512,5.955,5.091,1.05,10.274,9.767,9.046,7.786,5.92,8.384],[10.075,4.959,7.166,2.413,9.924,11.312,0,2.655,12.555,3.077,8.762,9.029,1.993,7.224,9.326,7.429,7.938,8.985,8.989,5.38,9.512,9.924,8.843,15.842,11.511,6.316,6.829,7.458,9.342,6.791,6.256,8.237,5.627,6.286,2.228,3.263,5.299,9.06,7.511,10.55,9.986,9.957,9.92,11.412,4.939,2.685,11.798,10.639,9.922,9.808],[10.376,6.021,7.467,1.237,10.225,11.612,2.499,0,12.855,4.693,9.063,9.33,4.525,7.524,9.627,7.729,8.239,9.286,9.29,5.56,9.812,10.225,9.144,16.143,11.812,7.937,8.451,9.08,9.643,8.412,7.878,8.336,7.249,6.508,3.843,4.324,6.36,9.022,7.473,10.851,10.286,10.258,10.22,11.712,6.55,4.301,12.098,10.939,10.223,10.109],[3.713,14.271,7.923,14.254,4.507,6.039,11.27,13.177,0,12.135,4.873,4.401,9.981,7.981,4.526,8.186,5.037,6.199,5.103,14.241,4.213,4.507,4.49,3.718,5.501,5.835,6.719,6.895,4.386,6.227,5.055,5.026,11.172,7.636,11.731,12.575,14.611,17.921,16.372,3.196,3.879,2.799,3.026,6.782,10.944,10.437,3.648,3.969,2.764,5.779],[5.997,5.119,5.86,5.499,6.288,10.006,2.495,5.081,11.249,0,4.946,5.44,0.917,4.45,4.877,4.059,4.245,4.753,5.353,5.486,5.83,6.288,5.027,14.537,7.566,4.097,4.611,5.24,5.454,4.572,4.038,4.496,3.409,4.901,3.173,3.449,5.023,9.165,7.617,6.706,6.141,8.651,8.614,10.106,2.72,1.253,7.963,6.803,8.616,5.863],[1.255,10.518,1.732,10.501,1.45,6.813,7.517,9.425,4.661,5.843,0,0.296,6.228,1.675,0.831,1.62,1.433,1.29,0.998,10.488,0.86,1.45,0.081,7.154,3.151,1.809,2.321,2.497,1.366,1.829,1.024,1.357,2.777,3.284,7.978,8.822,8.681,14.168,12.619,1.73,1.165,2.65,5.027,6.913,4.957,5.889,3.414,2.255,2.564,1.869],[1.285,10.513,2.215,10.496,1.48,7.296,7.512,9.419,4.691,5.822,0.472,0,6.223,2.064,1.313,1.948,1.762,1.773,0.702,10.483,1.587,1.48,0.564,7.184,3.182,1.715,2.228,2.403,1.849,1.735,1.065,1.84,2.757,3.278,7.973,8.817,10.853,14.163,12.614,1.76,1.195,2.68,5.241,7.396,4.937,6.679,3.555,2.396,2.594,1.9],[7.853,4.599,4.943,4.582,7.702,9.089,1.578,4.164,10.332,1.42,6.54,6.807,0,5.001,7.104,5.206,4.493,6.763,6.767,4.569,6.078,7.702,6.621,13.62,7.814,4.345,4.859,5.488,7.12,4.82,4.286,4.744,3.657,3.985,2.059,2.903,4.939,8.249,6.701,8.328,7.763,7.734,7.697,9.189,2.968,0.456,9.575,8.416,7.699,7.586],[2.508,8.81,0.243,8.793,3.057,5.906,5.808,7.716,7.295,4.801,1.895,1.951,4.52,0,0.97,0.561,1.042,0.629,2.122,8.78,2.341,3.057,1.976,10.582,4.644,1.935,2.449,3.268,0.986,2.6,1.876,0.818,2.481,2.116,6.27,7.114,9.15,12.459,10.911,3.217,2.652,2.718,4.12,6.006,3.916,4.976,4.931,3.772,2.632,2.941],[1.538,9.654,0.901,9.637,1.968,5.982,6.652,8.56,4.424,5.646,1.167,0.982,5.364,0.845,0,1.304,1.118,0.459,1.554,9.624,1.372,1.968,1.248,7.262,3.837,2.6,2.753,2.928,0.535,2.261,1.455,0.527,2.804,2.961,7.114,7.958,9.994,13.303,11.755,2.247,1.682,2.073,4.196,6.082,4.76,5.82,4.042,2.883,1.987,2.555],[2.647,9.303,0.727,9.286,2.495,6.217,6.302,8.21,5.136,4.985,1.334,1.6,5.013,0.483,0.985,0,0.186,0.695,1.561,9.273,2.083,2.495,1.415,10.894,4.082,1.296,1.888,2.707,1.098,2.039,1.314,0.438,1.5,2.069,6.763,7.607,7.823,12.953,11.405,3.122,2.557,3.029,4.431,6.317,4.099,5.469,4.369,3.21,2.943,2.379],[2.336,9.117,0.541,9.1,2.831,6.031,6.116,8.024,7.42,6.981,1.67,1.78,4.827,0.297,0.799,0.186,0,0.509,1.897,9.087,2.17,2.831,1.751,10.707,4.418,1.482,2.065,2.661,0.912,1.993,1.687,0.252,1.686,1.883,6.577,7.421,9.457,12.767,11.218,3.045,2.48,2.843,4.245,6.131,3.885,5.283,4.705,3.546,2.757,2.715],[2.124,9.194,0.442,9.177,2.554,5.523,6.193,8.101,6.911,5.187,1.753,1.568,4.904,0.385,0.586,0.845,0.659,0,2.507,9.164,1.958,2.554,1.834,10.199,4.423,2.14,2.724,3.32,0.602,2.652,2.261,0.662,2.345,2.501,6.654,7.498,9.534,12.844,11.295,2.833,2.268,2.335,3.737,5.623,4.301,5.36,4.628,3.469,2.249,3.141],[1.086,10.789,2.016,10.772,1.282,7.097,7.787,9.695,4.493,6.127,0.748,0.276,6.499,1.96,1.115,1.904,1.718,1.574,0,10.759,1.389,1.282,0.365,6.986,2.983,2.094,2.606,2.781,1.65,2.113,1.308,1.642,3.062,3.554,8.249,9.093,8.966,14.438,12.89,1.561,0.996,2.481,5.043,7.197,5.242,6.174,3.356,2.197,2.395,1.701],[12.178,1.056,9.269,4.181,12.027,13.415,5.924,5.467,14.658,4.283,10.865,11.132,4.936,9.327,11.429,9.531,10.041,11.088,11.092,0,11.615,12.027,10.946,17.945,13.614,9.795,10.309,10.938,11.445,10.27,9.736,10.34,9.107,8.31,3.056,2.508,1.603,3.661,1.98,12.653,12.088,12.06,12.023,13.515,8.418,3.985,13.901,12.742,12.025,11.911],[0.402,11.602,2.83,11.585,1.195,7.72,8.601,10.508,3.808,6.941,1.561,1.089,7.312,2.773,1.928,2.717,2.531,2.388,1.791,11.572,0,1.195,1.179,6.302,3.153,2.896,3.408,3.583,1.602,2.915,2.122,2.455,3.875,4.367,9.062,9.906,9.779,15.252,13.703,1.059,0.567,1.797,4.358,8.011,6.055,6.987,3.269,1.696,1.711,2.468],[0.743,11.705,3.034,11.688,0,7.638,8.703,10.611,4.651,7.014,1.766,1.293,7.415,2.978,2.133,2.922,2.736,2.592,1.453,11.674,0.843,0,1.383,6.6,1.958,2.643,3.155,3.33,1.92,2.662,2.256,2.659,3.634,4.47,9.164,10.008,12.045,15.354,13.806,1.439,0.874,2.639,5.201,7.738,6.128,7.87,2.074,0.915,2.553,1.781],[1.415,10.438,1.651,10.42,1.611,6.732,7.436,9.344,4.367,5.762,0.654,0.83,6.147,1.595,0.75,1.539,1.353,1.209,1.041,10.407,1.029,1.611,0,7.315,3.791,1.728,2.241,2.416,1.285,1.748,0.943,1.276,2.697,3.203,7.897,8.741,8.6,14.087,12.539,1.891,1.326,2.377,4.946,6.832,4.876,5.808,3.686,2.527,2.291,2.088],[6.331,18.501,12.152,18.483,6.658,10.41,15.499,17.407,4.054,16.365,7.491,7.018,14.21,12.21,7.858,12.415,7.861,10.864,7.72,18.47,6.651,6.658,7.108,0,7.148,8.825,9.337,11.034,7.21,8.844,8.051,8.384,15.401,11.866,15.96,16.804,18.84,22.15,20.602,5.713,6.496,5.802,6.181,10.127,15.173,14.666,4.526,6.84,5.767,7.462],[2.872,11.33,5.004,13.243,2.13,9.768,10.258,12.166,5.312,8.249,3.736,3.264,7.958,4.811,4.103,5.07,4.509,4.563,3.317,13.23,2.972,2.13,3.353,5.901,0,4.046,4.559,5.266,4.05,4.066,3.766,4.63,5.023,6.025,9.384,11.564,11.087,16.909,15.361,3.085,3.003,4.406,7.305,9.868,7.363,8.295,1.617,2.312,4.32,2.678],[2.861,7.823,2.028,7.978,2.579,7.519,6.029,8.219,6.045,4.741,1.639,2.05,4.451,1.785,2.286,1.302,1.488,1.996,1.774,10.54,2.993,2.579,2.14,8.76,3.821,0,0.583,1.179,2.399,0.511,0.96,1.74,1.255,3.335,5.877,6.153,7.58,14.219,12.671,3.336,2.771,4.055,5.733,7.619,3.856,4.788,4.218,3.059,3.969,1.775],[3.116,8.16,2.719,8.315,2.834,8.21,6.366,8.557,6.523,5.079,1.894,2.306,4.788,2.476,2.441,1.992,2.178,2.687,2.03,9.357,3.418,2.834,2.395,9.016,4.077,0.69,0,0.574,2.977,0.19,1.238,2.43,1.945,3.996,6.214,6.49,7.917,13.037,11.488,3.591,3.026,4.511,6.424,8.31,4.193,5.125,4.473,3.314,4.425,1.973],[3.578,7.929,3.181,8.084,3.296,8.672,6.135,8.326,6.985,4.848,2.356,2.768,4.557,2.938,2.904,2.454,2.64,3.149,2.492,9.126,3.881,3.296,2.857,9.478,4.408,1.153,0.633,0,3.439,0.652,1.7,2.892,2.077,4.458,5.983,6.259,7.686,12.806,11.258,4.053,3.488,4.973,6.886,8.772,3.962,4.894,4.935,3.776,4.887,2.279],[1.488,10.977,1.014,10.96,1.917,5.718,7.975,9.883,4.374,5.759,1.619,1.517,6.687,0.958,0.535,1.172,0.986,0.572,2.006,10.946,1.321,1.917,1.7,7.211,3.875,2.467,3.051,3.38,0,2.712,1.752,0.64,2.672,3.073,8.436,9.28,11.317,14.626,13.078,2.197,1.632,1.917,3.932,5.818,4.873,7.142,3.992,2.833,1.831,3.09],[3.049,8.41,2.535,8.564,2.767,8.025,6.616,8.806,6.456,5.328,1.827,2.239,5.038,2.291,2.375,1.808,1.994,2.503,1.963,11.046,3.352,2.767,2.328,8.949,4.01,0.497,0.447,1.021,2.91,0,1.171,2.246,1.761,3.841,6.464,6.74,8.167,14.725,13.177,3.524,2.959,4.444,6.239,8.125,4.443,5.375,4.406,3.247,4.358,1.977],[2.025,10.057,1.852,10.04,2.221,7.263,7.056,8.964,5.073,4.792,0.908,1.175,5.767,1.608,1.281,1.458,1.272,1.74,1.597,10.027,1.738,2.221,0.989,7.925,3.82,0.844,1.357,1.739,1.816,1.072,0,1.581,1.727,2.823,5.928,8.361,7.631,13.707,12.158,2.5,1.935,3.083,5.477,7.363,3.907,4.839,4.216,3.057,2.997,2.117],[2.477,9.157,0.404,9.14,2.906,5.875,6.155,8.063,7.263,5.149,2.243,1.92,4.867,0.348,0.938,0.909,1.011,0.598,2.47,9.127,2.31,2.906,2.324,10.551,4.992,2.283,2.797,3.616,0.955,2.948,2.224,0,2.697,2.464,6.617,7.461,9.497,12.806,11.258,3.186,2.621,2.687,4.089,5.975,4.264,5.323,4.981,3.822,2.601,3.289],[3.047,9.49,1.284,9.473,3.338,8.131,6.489,8.396,5.933,4.895,1.996,2.49,5.2,1.041,1.927,1.109,1.295,1.803,2.403,9.46,2.88,3.338,2.077,12.661,4.616,1.147,1.661,2.29,2.504,1.622,1.088,1.547,0,2.255,6.95,7.794,9.83,13.14,11.591,3.756,3.191,3.943,6.739,8.231,4.009,5.656,5.013,3.854,3.857,2.913],[3.539,8.557,0.929,8.54,4.116,7.198,5.556,7.463,8.441,4.611,2.955,2.982,4.267,1.06,2.001,1.621,2.073,1.66,3.182,8.527,3.372,4.116,3.036,11.728,5.703,2.995,3.377,4.158,2.017,4.416,2.935,1.849,3.87,0,6.017,6.861,8.897,12.207,10.658,4.248,3.683,3.75,5.806,7.298,3.905,4.723,5.99,4.831,3.664,4],[9.61,3.144,6.7,2.936,9.458,10.846,2.269,3.942,12.089,1.66,8.297,8.563,1.743,6.758,8.861,6.963,5.905,8.52,8.524,3.273,7.49,9.458,8.378,15.377,9.226,5.757,6.271,6.9,8.877,6.232,5.698,6.156,5.069,5.741,0,1.357,3.484,7.889,6.34,10.085,9.52,9.491,9.454,10.946,4.378,1.301,11.332,10.173,9.456,9.342],[10.477,1.696,7.567,3.139,10.325,11.713,3.333,4.425,12.956,1.933,9.164,9.43,3.234,7.625,9.727,7.83,6.178,9.387,9.391,2.037,7.764,10.325,9.245,16.244,9.5,6.031,6.544,7.173,9.744,6.505,5.971,6.43,5.342,6.608,1.447,0,2.036,6.459,4.911,8.639,8.074,10.358,10.321,11.813,4.652,2.392,9.896,8.737,10.323,10.209],[9.416,0.835,9.603,5.176,9.707,13.749,5.37,6.461,14.992,3.594,8.365,8.86,5.271,9.661,11.764,9.866,7.664,11.423,8.773,1.476,9.25,9.707,8.446,18.28,10.986,7.517,8.03,8.659,11.78,7.992,7.457,7.916,6.828,8.645,3.483,2.036,0,3.783,2.782,10.125,9.56,12.394,12.357,13.849,5.7,4.052,11.382,10.223,12.359,9.283],[15.106,4.055,12.196,7.454,14.954,16.342,8.851,7.77,17.585,8.302,13.793,14.059,7.863,12.254,14.356,12.459,12.969,14.016,14.019,3.778,14.542,14.954,13.873,20.873,16.541,12.723,13.236,13.865,14.373,13.198,12.663,13.268,12.034,11.237,7.267,6.719,3.782,0,2.132,15.581,15.016,14.987,14.95,16.442,11.346,8.319,16.828,15.669,14.952,14.838],[14.615,2.125,11.705,6.963,14.463,15.851,8.36,7.279,17.094,7.811,13.302,13.568,7.372,11.763,13.865,11.968,12.478,13.525,13.528,1.848,14.051,14.463,13.382,20.382,16.05,12.232,12.745,13.374,13.882,12.707,12.172,12.777,11.543,10.746,6.776,3.821,2.548,2.328,0,15.09,14.525,14.496,14.459,15.951,10.855,7.828,16.337,15.178,14.461,14.347],[0.941,13.032,3.313,13.015,1.439,7.108,10.03,11.938,3.196,7.424,2.045,1.573,8.742,3.257,2.412,3.201,3.015,2.872,2.561,13.002,1.122,1.439,1.662,5.689,2.874,3.379,3.891,4.067,2.2,3.399,2.605,2.939,4.359,4.851,10.492,11.336,10.263,16.681,15.133,0,0.991,1.32,3.746,8.018,6.539,9.198,2.506,0.773,1.234,2.587],[0.329,11.529,2.756,11.512,1.122,7.837,8.527,10.435,3.735,6.868,1.488,1.016,7.239,2.7,1.855,2.644,2.458,2.315,1.718,11.499,0.649,1.122,1.106,6.228,3.08,2.822,3.335,3.51,1.547,2.842,2.048,2.382,3.802,4.294,8.989,9.833,9.706,15.178,13.63,0.852,0,1.723,4.285,7.938,5.982,6.914,3.196,1.489,1.637,2.395],[1.487,12.585,2.895,12.568,2.28,6.347,9.583,11.491,2.641,7.219,2.646,2.174,8.295,2.839,2.3,2.996,2.81,2.453,2.876,12.555,1.987,2.28,2.264,5.478,3.931,3.98,4.493,4.668,2.159,4,2.829,2.799,4.154,5.95,10.045,10.889,12.925,16.234,14.686,1.194,1.652,0,2.985,7.079,6.334,8.751,3.564,1.831,0.637,3.553],[3.748,11.614,5.266,11.597,4.541,4.558,8.612,10.52,3.06,9.478,6.862,4.435,7.324,5.324,4.153,5.528,4.225,3.812,7.089,11.584,4.248,4.541,4.525,6.459,6.594,6.903,7.416,8.235,4.169,7.568,6.843,4.229,8.514,4.979,9.074,9.918,11.954,15.263,13.715,3.455,3.913,2.663,0,5.302,8.287,7.78,5.764,4.092,2.226,7.908],[7.575,13.808,6.138,13.791,8.005,1.606,10.807,12.715,9.468,11.672,7.204,7.019,9.518,6.081,6.037,6.295,6.109,5.696,7.591,13.778,7.409,8.005,7.285,12.756,9.874,7.591,8.174,8.77,6.053,8.103,7.796,6.113,10.709,7.174,11.268,12.112,14.148,17.458,15.909,7.861,7.719,6.668,6.764,0,10.481,9.974,10.079,8.92,6.633,8.592],[7.364,3.585,8.099,5.339,7.655,12.245,3.862,5.709,13.488,1.368,6.313,6.808,2.284,5.818,6.245,5.426,5.612,6.121,6.721,4.774,7.198,7.655,6.394,16.775,8.934,5.465,5.978,6.607,6.821,5.94,5.405,5.864,4.776,7.14,2.487,2.763,3.724,9.579,8.03,8.073,7.509,10.89,10.853,12.345,0,1.845,9.33,8.171,10.855,7.231],[6.344,5.042,5.386,5.025,6.635,9.532,2.021,4.607,10.775,1.086,5.293,5.787,0.443,5.444,7.547,5.649,4.592,7.206,5.7,5.012,6.177,6.635,5.374,14.063,7.913,4.444,4.958,5.587,7.563,4.919,4.385,4.843,3.756,4.427,1.504,3.346,4.211,8.692,7.143,7.053,6.488,8.177,8.14,9.632,3.067,0,8.309,7.15,8.142,6.21],[2.875,11.588,5.007,13.501,2.132,8.946,10.516,12.424,3.601,8.507,3.739,3.266,8.216,4.951,4.106,4.895,4.709,4.565,3.337,13.488,2.975,2.132,3.356,4.526,1.854,4.729,4.801,5.92,4.053,4.309,4.024,4.633,5.281,6.283,9.642,11.822,11.345,17.167,15.619,2.506,3.006,3.826,5.594,9.871,7.621,8.553,0,2.315,3.74,2.936],[1.578,10.466,3.884,12.378,1.01,7.881,9.394,11.302,3.969,7.384,2.616,2.144,7.093,3.828,2.983,3.772,3.586,3.443,2.215,12.365,1.759,1.01,2.233,6.742,2.1,3.606,3.679,4.797,2.837,3.186,2.901,3.51,4.158,5.16,8.519,10.699,10.222,16.045,14.496,0.773,1.628,2.094,4.519,8.655,6.498,7.43,2.217,0,2.008,1.813],[1.787,12.214,2.808,12.197,2.581,5.976,9.212,11.12,2.747,10.078,2.947,2.475,7.924,2.752,2.124,2.966,2.78,2.366,3.177,12.183,2.287,2.581,2.564,5.584,4.232,4.281,4.793,4.969,1.944,4.301,3.129,2.645,4.455,5.579,9.673,10.517,12.554,15.863,14.315,1.495,1.953,0.301,2.614,6.707,8.887,8.379,3.864,2.132,0,3.853],[1.725,8.652,2.655,10.565,1.444,7.736,7.58,9.488,5.132,5.571,1.387,0.915,5.28,2.133,1.754,2.392,1.831,2.214,0.639,10.552,2.028,1.444,1.005,7.625,3.073,1.353,1.865,2.04,2.29,1.373,1.088,2.281,2.345,3.347,6.706,8.886,8.409,14.231,12.683,2.201,1.636,3.121,5.682,7.837,4.685,5.617,3.317,2.158,3.035,0]]";
                matrixBetweenLocationsAndDepot = "[4.886,4.71,3.583,5.667,5.177,9.464,3.729,5.909,10.707,2.431,3.835,4.33,2.141,3.339,3.767,2.948,3.134,3.643,4.242,6.71,4.72,5.177,3.916,13.994,6.456,2.987,3.5,4.129,4.343,3.461,2.927,3.386,2.298,4.359,3.566,3.843,4.849,10.389,8.841,5.595,5.03,5.782,8.072,9.564,1.125,2.477,6.852,5.693,5.696,4.753]";
            }

            data += "["+matrixBetweenDeliveryLocations+"],";
            data += "["+matrixBetweenLocationsAndDepot+"],";
        }
        else {
            data += "["+JSON.stringify(matrixBetweenDeliveryLocations)+"],";
            data += "["+JSON.stringify(matrixBetweenLocationsAndDepot)+"],";   
        }

       
        data += "["+JSON.stringify(vehiclesCapacity)+"],";
        data += "["+JSON.stringify(goodsPerLocations)+"],";
        data += "["+JSON.stringify(g_Method)+"]";
        data += "]";

        // console.log(JSON.stringify(matrixBetweenDeliveryLocations));
        // console.log(JSON.stringify(matrixBetweenLocationsAndDepot));

        xmlhttp.open("POST", "server/main.php?", true);
        xmlhttp.send(data);
        t0 = performance.now();
        console.log("DATA IS SENT TO SERVER");
    }

    function convertLocationFromArrayToString(locations) {

        var l = "";

        for(var i = 0; i < locations.length; i++) {
            l += locations[i].lat + "," + locations[i].lng;
            if (i != locations.length - 1) {
                l+= "|";
            }
        }

        return l;
    }

    function updateDeliveryMatrixLocations(m, k, l) {
        
        for(var i = 0; i < m.length; i++) {
            for(var j = 0; j < m[0].length; j++) {
                matrixBetweenDeliveryLocations[i+k][j+l] = m[i][j];
            }
        }
    }

    function showErrorFrom(status) {

        document.getElementById("mainDivLoader").style.display = "none";
        alert("Error on google map api server side.\nStatus: " + status + "\nPlease try again.");

    }

    function calculateDistanceDeliveryDelivery(locationsInGroup, i, j, current, numberOfRequest) {

        if (current == numberOfRequest) {
            console.log("Distances between delivery locations are calculated");
            prepereDeliveryDepotLocationForServer();
        }
        else {

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    if(response['status'] == "OK") {
                        //console.log(response);
                        var m = distanceMatrixBetweenLocations(response);
                        updateDeliveryMatrixLocations(m, i*10, j*10);
                        var k = Math.sqrt(numberOfRequest);
                        if (j < k-1) {
                            j++;
                        }
                        else {
                            j = 0;
                            i++;
                        }
                        calculateDistanceDeliveryDelivery(locationsInGroup, i, j, current+1, numberOfRequest);                    
                    }
                    else {
                        showErrorFrom(response['status']);
                        return;
                    }
                }
            }
            var origins = convertLocationFromArrayToString(locationsInGroup[i]);
            var destinations = convertLocationFromArrayToString(locationsInGroup[j]);
            var url = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins="+origins+"&destinations="+destinations+"&key=AIzaSyCl4x54NRlMWqsfyOW13ebDRFNZhHPVqKI";
            xmlhttp.open("POST", url, true);
            xmlhttp.send();
        }
    }

    function calculateDistanceDepotDelivery(origins, splitedLocations, current, numberOfDepotRequest) {

        if (current == numberOfDepotRequest) {
            console.log("Distance between depot and delivery are calculated.");
            prepareVehiclesForServer();
            prepareGoodsForServer();
            sendDataToServer();
        }
        else {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    if(response['status'] == "OK") {
                        distanceDepotArrayBetweenLocations(response);
                        calculateDistanceDepotDelivery(origins, splitedLocations, current+1, numberOfDepotRequest);
                    }
                    else {
                        showErrorFrom(response['status']);
                        return;
                    }
                }
            }
            var destinations = convertLocationFromArrayToString(splitedLocations[current]);
            var url = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins="+origins+"&destinations="+destinations+"&key=AIzaSyCl4x54NRlMWqsfyOW13ebDRFNZhHPVqKI";
            xmlhttp.open("POST", url, true);
            xmlhttp.send();
        }
    }

    // DELIVERY LOCARION
    function prepereDeliveryLocationsForServer() {

        matrixBetweenDeliveryLocations = [];
        var locations = convertDeliveryLocationForGoogleMapApi();
        for (var i = 0; i < locations.length; i++) {
            var row = [];
            for (var j = 0; j < locations.length; j++) {
                row.push(0);
            }
            matrixBetweenDeliveryLocations.push(row);
        }

        var step = 10;
        var numberOfRequest = 1;

        if (locations.length > step) {
            numberOfRequest = Math.ceil(locations.length/step);
        }

        var locationsInGroup = [];

        for(var i = 0; i < numberOfRequest; i++) {
            var first = i*step;
            var second = (i+1)*step;
            if (second > locations.length) {
                second = locations.length;
            }
            locationsInGroup.push(locations.slice(first, second));
        }


        calculateDistanceDeliveryDelivery(locationsInGroup, 0, 0, 0, numberOfRequest*numberOfRequest);
    }

    //DEPOT LOCATION
    function prepereDeliveryDepotLocationForServer() {
        matrixBetweenLocationsAndDepot = [];
        var splitedLocations = [];
        var numberOfDepotRequest = 1;
        var locations = convertDeliveryLocationForGoogleMapApi();
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

        var origins = g_DepotLocation['lat'] + "," + g_DepotLocation['lng'];
        calculateDistanceDepotDelivery(origins, splitedLocations, 0, numberOfDepotRequest);
    }

    // VEHICLES
    function prepareVehiclesForServer() {
        vehicles = [];
        vehiclesCapacity = [];
        for (var i = 0; i < g_Vehicles.length; i++) {
            vehicles.push(g_Vehicles[i]);
        }

        vehicles.sort(function(a, b) {
            return b.getVehicleCapacity() - a.getVehicleCapacity();
        });

        for (var i = 0; i < vehicles.length; i++) {
            vehiclesCapacity.push(vehicles[i].getVehicleCapacity());
        }

        // console.log(vehiclesCapacity);

    }

    //GOODS PER LOCATIONS
    function prepareGoodsForServer() {
        goodsPerLocations = [];
        for (var i = 0; i < g_DeliveryLocations.length; i++) {
            goodsPerLocations.push(g_DeliveryLocations[i].getQuantity());
        }
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
            
            g_Result = [];
            //Show loader
            document.getElementById("mainDivLoader").style.display = "block";

            if(g_UseTestExample) {
                console.log("BEZ GOOGLE MAPS");

                prepareVehiclesForServer();
                prepareGoodsForServer();
                sendDataToServer();
            }
            else {
                console.log("SA GOOGLE MAPS");
                prepereDeliveryLocationsForServer();
            }
        } catch (err) {
            alert(err);
            return;
        }
    }
})
