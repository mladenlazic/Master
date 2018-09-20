<?php
	$locations = $_REQUEST["l"];
	$vehicles = $_REQUEST["v"];
    $goodsPerLocation = $_REQUEST["g"];

	$json_locations = json_encode($locations);
	$json_vehicles = json_encode($vehicles);
	$json_goodsPerLocation = json_encode($goodsPerLocation);

	$method = "BF";

	$python = "C:\Users\Mladen\Anaconda3\python";
	$result = exec($python." parse_input_data.py ".$json_locations." ".$json_vehicles." ".$method." ".$json_goodsPerLocation);

	echo $result;
?>