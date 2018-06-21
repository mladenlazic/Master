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
	console.log(window.innerHeight);
	document.getElementById("mainLayout").style.height = window.innerHeight;

	var gmapRowNav = document.getElementById('gmapRowNav').offsetHeight ;
	var gmapRowInputText = document.getElementById('gmapRowInputText').offsetHeight ;
	var gmapRowBtnAdd = document.getElementById('gmapRowBtnAdd').offsetHeight ;

	var gmapRowBtnCompute = document.getElementById('gmapRowBtnCompute').offsetHeight ;

	var mainLayout = document.getElementById('mainLayout').offsetHeight;
	document.getElementById("gmapMap").style.height = mainLayout-40;
	document.getElementById("txtaAddPositions").style.height = mainLayout - 40 - gmapRowBtnAdd - gmapRowNav - gmapRowInputText - gmapRowBtnCompute;
	var dataStartPosition = [];
    var dataEndPosition = [];

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

	$scope.addStartPositions = function() {

		console.log("Enter in addStartPositions");

		// document.getElementById("legendSpanValue").textContent = "Add start stations";
		// document.getElementById("gmapPositionsBox").style.visibility = "visible";
		// document.getElementById("gmapVehiclesBox").style.visibility = "hidden";

		var inputPositionsBox = document.getElementById('txtInsertPosition');
		var searchBoxStartPosition = new google.maps.places.SearchBox(inputPositionsBox);
		document.getElementById("txtInsertPosition").placeholder = "Enter start position...";

		// var places = searchBoxStartPosition.getPlaces();
		// console.log(places);
		// var name = places[0].vicinity;
		// var lat = places[0].geometry.location.lat();
		// var lng = places[0].geometry.location.lng();
		// var marker_color = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"

		// var obj = { "lat": lat, "lng":lng };
		// dataStartPosition.push(obj);

		// addMapMarker(name, lat, lng, marker_color);
		
	}

	$scope.addEndPositions = function() {

		// document.getElementById("legendSpanValue").textContent = "Add end stations";
		// document.getElementById("gmapPositionsBox").style.visibility = "visible";
		// document.getElementById("gmapVehiclesBox").style.visibility = "hidden";

		var inputPositionsBox = document.getElementById('txtInsertPosition');
		var searchBoxStartPosition = new google.maps.places.SearchBox(inputPositionsBox);
		document.getElementById("txtInsertPosition").placeholder = "Enter end position...";


		// var places = searchBoxEndtPosition.getPlaces();
		// var name = places[0].vicinity;
		// var lat = places[0].geometry.location.lat();
		// var lng = places[0].geometry.location.lng();
		// var marker_color = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"

		// var obj = { "lat": lat, "lng":lng };
		// dataEndPosition.push(obj);

		// addMapMarker(name, lat, lng, marker_color);

	}

	$scope.addVehicles = function() {

		document.getElementById("gmapPositionsBox").style.visibility = "hidden";
		document.getElementById("gmapVehiclesBox").style.visibility = "visible";

	}

	$scope.computeRoute = function() {

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
				console.log(response)
            }
        });


        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
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


	    console.log(JSON.stringify(dataStartPosition));
	    console.log(JSON.stringify(dataEndPosition));

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(map);
        calculateAndDisplayRoute(directionsService, directionsDisplay);

	}
})