<?php
	ini_set('max_execution_time', 3600);
	$locations = $_REQUEST["l"];
	$depot = $_REQUEST["d"];
	$vehicles = $_REQUEST["v"];
    $goodsPerLocation = $_REQUEST["g"];
    $method = $_REQUEST["m"];

	$json_locations = json_encode($locations);
	$json_depot = json_encode($depot);
	$json_vehicles = json_encode($vehicles);
	$json_goodsPerLocation = json_encode($goodsPerLocation);

	$python = "C:\Users\Mladen\Anaconda3\python";
	$result = exec($python." main.py ".$json_locations." ".$json_depot." ".$json_vehicles." ".$method." ".$json_goodsPerLocation);

	echo $result;
?>
