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
// $distanceDepotFromLocations = array(12,45,54,60);
// $vehiclesIndex = array(0,1,2,3);
// $vehiclesCapacity = array(40,20,20,1);
// $goodsPerLocations = array(10,20,10,10);
// $locationsIndex = array(0,1,2,3);

ini_set('max_execution_time', 3600);
ini_set('memory_limit', '2000M');
$locations = $_REQUEST["l"];
$depot = $_REQUEST["d"];
$vehicles = $_REQUEST["v"];
$goodsPerLocation = $_REQUEST["g"];
$method = $_REQUEST["m"];
$distanceBetweenLocations = json_decode($locations);
$locationsIndex = array();

for ($i = 0; $i < count($distanceBetweenLocations); $i++) {
    array_push($locationsIndex, $i);
}

$distanceDepotFromLocations = json_decode($depot);
$goodsPerLocations = json_decode($goodsPerLocation);
$vehiclesCapacity = json_decode($vehicles);
$vehiclesIndex = array();

for ($i = 0; $i < count($vehiclesCapacity); $i++) {
    array_push($vehiclesIndex, $i);
}

if ($method == "BF") {
    $result = BF($locationsIndex, $distanceBetweenLocations, $distanceDepotFromLocations, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity);
    $r = json_encode($result);
    echo $r;
}
else {
    $result = SA($locationsIndex, $distanceBetweenLocations, $distanceDepotFromLocations, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity);
    $r = json_encode($result);
    echo $r;
}

?>
