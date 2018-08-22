<?php
	$locations = $_REQUEST["l"];
	$vehicles = $_REQUEST["v"];
    
  	$json_locations = json_decode($locations);  	
  	$json_vehicles = json_decode($vehicles);  	

  	$python = "C:\Python27\python";
  	$result = exec($python." parse_input_data.py");

  	echo $result;
?>