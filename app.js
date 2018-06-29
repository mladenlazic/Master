var app = angular.module('vrp', ['ngRoute'])
.config(function($routeProvider)
{
	$routeProvider
	.when("/",
	{
		templateUrl: "view/login.html"
	})
	.when("/signup",
	{
		templateUrl: "view/signup.html"
	})
	.when("/resetPassword",
	{
		templateUrl: "view/resetPassword.html"
	})
	.when("/gmap",
	{
		templateUrl: "view/gmap.html"
	})
})
.controller("loginController", function($location, $scope, $http)
{
	$scope.loginCheck = function()
	{
		var email = $scope.email;
		var password = $scope.password;
		//TODO Add the test options


		$http.post("http:/Master/api.php/login/" + email)
			.success(function(data)
			{
			    if(data.login == true && data.password == password) {
			    	console.log("logovan je");
			    	$location.path("/gmap");
			    }
			    else if(data.login == true) {
			    	console.log("pogresan pass");
			    }
			    else if(data.login == false) {
			    	console.log("pogresan mail");	
			    }
			})	
	}

	$scope.createAccount = function()
	{
		$location.path("/signup");
	}

	$scope.resetPassword = function()
	{
		$location.path("/resetPassword");
	}
})
.controller("signupController", function($location, $scope, $http)
{
	$scope.signup = function()
	{
		console.log("daa");
	}

	$scope.signinFromSignup = function()
	{
		$location.path("/");
	}
})
.controller("resetPasswordController", function($location, $scope, $http)
{
	$scope.signinFromResetPassword = function()
	{
		$location.path("/");
	}
})
.controller("gmapController", function($location, $scope, $http)
{
	document.getElementById("insertDataMessage").style.padding = "50% 0";
	document.getElementById("addPositions").style.display = "none";
	document.getElementById("mainLayout").style.height = window.innerHeight;
	var gmapTitleLine = 40;
	var mainLayout = document.getElementById('mainLayout').offsetHeight;
	var gmapRowNav = document.getElementById('gmapRowNav').offsetHeight ;
	var gmapRowBtnCompute = document.getElementById('gmapRowBtnCompute').offsetHeight ;
	gmapInputDataHeight = mainLayout-gmapTitleLine-gmapRowBtnCompute-gmapRowNav;
	document.getElementById("gmapMap").style.height = mainLayout-gmapTitleLine;
	document.getElementById("gmapInputData").style.height = gmapInputDataHeight;
	var mainLayout = document.getElementById('insertDataMessage').offsetHeight;
	document.getElementById("gmapInputData").style.border = "1px white solid";

	var insertingStartPosition = 1;
	var dataStartPosition = [];
    var dataEndPosition = [];
    var searchBoxPosition;

	var map = new google.maps.Map(document.getElementById('gmapMap'), {
		zoom: 8,
    	center: {lat: 44.787197, lng: 20.457273}
	});

    function addMapMarker(name, lat, lng, marker_color) {
    	
        var infowindow = new google.maps.InfoWindow({
          content: '<div id="namePlace">' + name + '</div>'
        });

        var latlng = {lat: lat, lng: lng};
    	var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: marker_color
        });

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
    }

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

	$scope.reloadPage = function() {
		location.reload();
	}

	$scope.addStartPositions = function() {
		setUpStartEndPositionDesignSettings();
		document.getElementById("txtInsertPosition").placeholder = "Enter start position...";
		insertingStartPosition = 1;
	}

	$scope.addEndPositions = function() {
		setUpStartEndPositionDesignSettings();
		document.getElementById("txtInsertPosition").placeholder = "Enter end position...";
		insertingStartPosition = 0;
	}

	$scope.addPositionToArray = function() {
		var places = searchBoxPosition.getPlaces();
		console.log(places);
		var name = places[0].vicinity;
		var lat = places[0].geometry.location.lat();
		var lng = places[0].geometry.location.lng();
		var location_name = places[0].formatted_address;
		var obj = {"lat": lat, "lng":lng };
		if (insertingStartPosition) {
			dataStartPosition.push(obj);
			var marker_color = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
		}
		else {
			dataEndPosition.push(obj);
			var marker_color = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
		}
		addMapMarker(name, lat, lng, marker_color);
		document.getElementById('txtInsertPosition').value="";

	}

	$scope.addVehicles = function() {
		//TODO
	}

	$scope.computeRoute = function() {
		// TO DO Check if the data is okay
		// alert("Insert or check your input data!");
		var service = new google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
          origins: dataStartPosition,
          destinations: dataEndPosition,
          travelMode: 'DRIVING',
          unitSystem: google.maps.UnitSystem.METRIC,
        }, function(response, status) {
          if (status !== 'OK') {
            alert('Error was: ' + status);
          } else {
          	//Response from google map server
          	//Format matrix and sent it to the server to calculating the best route for each vehicle
				console.log(response)
            }
        });

	    // console.log(JSON.stringify(dataStartPosition));
	    // console.log(JSON.stringify(dataEndPosition));

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(map);
        calculateAndDisplayRoute(directionsService, directionsDisplay);
	}
})
