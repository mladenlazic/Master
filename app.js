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

	var dataStartPosition = [];
    var dataEndPosition = [];

	var map = new google.maps.Map(document.getElementById('gmapMap'), {
		zoom: 8,
    	center: {lat: 44.787197, lng: 20.457273}
	});

	// Configure start position text field
	var inputStartPosition = document.getElementById('txtInsertStartPosition');
    var searchBoxStartPosition = new google.maps.places.SearchBox(inputStartPosition);

    // Configure end position text field
	var inputEndPosition = document.getElementById('txtInsertEndPosition');
    var searchBoxEndtPosition = new google.maps.places.SearchBox(inputEndPosition);

    function addMapMarker(name, lat, lng) {
    	
        var infowindow = new google.maps.InfoWindow({
          content: name
        });

        var latlng = {lat: lat, lng: lng};
    	var marker = new google.maps.Marker({
            position: latlng,
            map: map
        });

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
    }

	$scope.addStartPositions = function() {

		var places = searchBoxStartPosition.getPlaces();
		var name = places[0].vicinity;
		var lat = places[0].geometry.location.lat();
		var lng = places[0].geometry.location.lng();

		dataStartPosition.push('{"name":' + name + ', "lat":' + lat + ', "lng":' + lng + '}');
		addMapMarker(name, lat, lng);
		
	}

	$scope.addEndPositions = function() {

		var places = searchBoxEndtPosition.getPlaces();
		var name = places[0].vicinity;
		var lat = places[0].geometry.location.lat();
		var lng = places[0].geometry.location.lng();

		dataEndPosition.push('{"lat":' + lat + ', "lng":' + lng + '}');
		addMapMarker(name, lat, lng);

	}

	$scope.computeRoute = function() {

		var objStartPosition = JSON.parse(dataStartPosition);
		var objEndPosition = JSON.parse(dataEndPosition);
		console.log(objStartPosition);
		console.log(objEndPosition);
		// TO DO Send this to server.
	}	

})