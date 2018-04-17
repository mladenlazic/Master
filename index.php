<html ng-app = "vrp">
	<head>
		<title>
			Vehicle routing problem
		</title>

		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.32/angular.min.js"></script>
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.32/angular-route.js"></script>
		<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDBmcxLHw3pFl9hDSxp3P1nVGUeZTJW6GY&libraries=places"></script>
		<script type="text/javascript" src="http://www.google.com/jsapi"></script>
		
		<script src = "app.js"></script>
		<link rel = "stylesheet" href = "style.css">
		<link rel="icon" href="pictures/logo.png">

	</head>
	
	<body>
		<div ng-view>
		</div>
	</body>
</html>