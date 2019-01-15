<?php

include "BF.php";
include "SA.php";
include "utils.php";
// $distanceBetweenLocations = array
// (
// 	array(0,2,3,3),
// 	array(2,0,4,4),
// 	array(3,4,0,5),
// 	array(3,4,5,0),
// );
$data = file_get_contents('php://input');
$dataFromClient = json_decode($data);

// $distanceDepotFromLocations = array(12,45,54,60);
// $vehiclesIndex = array(0,1,2,3);
// $vehiclesCapacity = array(40,20,20,1);
// $goodsPerLocations = array(10,20,10,10);
// $locationsIndex = array(0,1,2,3);

ini_set('max_execution_time', 4000);
ini_set('memory_limit', '2000M');
ini_set('always_populate_raw_post_data', '-1');


$locations = $dataFromClient[0][0];
$depot = $dataFromClient[1][0];
$vehicles = $dataFromClient[2][0];
$goodsPerLocation = $dataFromClient[3][0];
$method = $dataFromClient[4][0];

$distanceBetweenLocations = $locations;
$locationsIndex = array();

for($i=0; $i<count($distanceBetweenLocations); $i++) {
	array_push($locationsIndex, $i);
}

$distanceDepotFromLocations = $depot;
$goodsPerLocations = $goodsPerLocation;
$vehiclesCapacity = $vehicles;

$vehiclesIndex = array();
for($i=0; $i<count($vehiclesCapacity); $i++) {
	array_push($vehiclesIndex, $i);
}

if ($method == "BF") {
	$result = BF($locationsIndex, $distanceBetweenLocations, $distanceDepotFromLocations, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity);
	$r = json_encode($result);
	echo $r;
}
else {
	$result = SA($locationsIndex, $distanceBetweenLocations, $distanceDepotFromLocations, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity);
	// $r = json_encode($result);
	// echo $r;
}

?>