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
	angular.element(document).ready(function() {
        initMap();
    })

	function initMap() {

    	var loc = {};

		if (navigator.geolocation) {
        	navigator.geolocation.getCurrentPosition(function(position){
        		
        		loc.lat = position.coords.latitude;
	            loc.lng = position.coords.longitude;

	           	var uluru = {lat: loc.lat, lng: loc.lng};
				var map = new google.maps.Map(document.getElementById('gmapMap'), {
		    		zoom: 14,
			    	center: uluru
				});
		        
		        var marker = new google.maps.Marker({
			        position: uluru,
			        map: map
		        });
        	});

    	}
    	else {
    		console.log("navigator.geolocation does not define");
    	}

	}
})