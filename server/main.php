<?php
	$locations = $_REQUEST["l"];
	$vehicles = $_REQUEST["v"];
    
  	$json_locations = json_decode($locations);  	
  	$json_vehicles = json_decode($vehicles);
    echo $json_vehicles->{"vehicles"}[0]->{"id"};
?>