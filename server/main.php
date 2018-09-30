<?php

function factorial($number){
    if($number == 0){
        return 1;
    }
    else{
        return $number * factorial($number-1);
    }
}

function nextPermutation($array) {
    // Find longest non-increasing suffix
    $i = count($array) - 1;
    while ($i > 0 && $array[$i - 1] >= $array[$i])
        $i--;
    // Now i is the head index of the suffix
    
    // Are we at the last permutation already?
    if ($i <= 0)
        return -1;
    
    // Let array[i - 1] be the pivot
    // Find rightmost element that exceeds the pivot
    $j = count($array) - 1;
    while ($array[$j] <= $array[$i - 1])
        $j--;
    // Now the value array[j] will become the new pivot
    // Assertion: j >= i
    
    // Swap the pivot with j
    $temp = $array[$i - 1];
    $array[$i - 1] = $array[$j];
    $array[$j] = $temp;
    
    // Reverse the suffix
    $j = count($array) - 1;
    while ($i < $j) {
        $temp = $array[$i];
        $array[$i] = $array[$j];
        $array[$j] = $temp;
        $i++;
        $j--;
    }
    
    // Successfully computed the next permutation
    return $array;
}

function fillVehicle($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity){
	$numberOfLocations = count($locations);
	$numberOfVehicles = count($vehiclesCapacity);

	if ($numberOfLocations <= 0 and $numberOfVehicles <= 0){
		return -1;
	}

	$pathPerVehicle = array();

	for ($i = 0; $i < $numberOfVehicles; $i++) {
		array_push($pathPerVehicle, array());
	}

	$vehicleNumber = 0;
	$locationNumber = 0;
	$currentVehicleFreeCapacity = $vehiclesCapacity[$vehicleIndex[$vehicleNumber]];
	$sumOfGoodsPerLocations = array_sum($goodsPerLocations);

	while ($sumOfGoodsPerLocations){

		if($vehicleNumber == $numberOfVehicles){
			return -1;
		}
		$goods = $goodsPerLocations[$locations[$locationNumber]];

		if($goods <= $currentVehicleFreeCapacity){
			$sumOfGoodsPerLocations -= $goodsPerLocations[$locations[$locationNumber]];
			$currentVehicleFreeCapacity -= $goodsPerLocations[$locations[$locationNumber]];
			array_push($pathPerVehicle[$vehicleIndex[$vehicleNumber]], $locations[$locationNumber]);
			$locationNumber += 1;
		}
		else{
			$vehicleNumber += 1;
			if ($vehicleNumber != $numberOfVehicles){
				$currentVehicleFreeCapacity = $vehiclesCapacity[$vehicleIndex[$vehicleNumber]];
			}
		}
	}
	return $pathPerVehicle;
}

function BF($locations, $distanceBetweenLocations, $distanceDepotFromLocations, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity){

	$bestDistance = 99999999;
	$goodsPerVehiles = "N/A";
	$loc = $locations;
	$vi = $vehiclesIndex;
	$numberOfPermutationLocation = factorial(count($locations));
	$numberOfPermutationVehicle = factorial(count($vehiclesIndex));
	for ($l = 0; $l < $numberOfPermutationLocation; $l++) {
		if($l != 0){
			$locations=nextPermutation($locations);

		}
		for ($k = 0; $k < $numberOfPermutationVehicle; $k++) {
			if($k != 0){
				$vehiclesIndex=nextPermutation($vehiclesIndex);
			}
			$pathPerVehicle = fillVehicle($locations, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity);
			
			$currentDistanceForAllVehicle = 0;
			if ($pathPerVehicle != -1) {

			for ($i = 0; $i < count($pathPerVehicle); $i++) {

					# ako je samo vozilo u nizu -> preskoci
					if (count($pathPerVehicle[$i]) != 0) {
						$currentDistance = 0;
						#uzmemo samo lokacije bez vozila
				 		for ($j = 0; $j < count($pathPerVehicle[$i])-1; $j++) {					
							$currentDistance += $distanceBetweenLocations[$pathPerVehicle[$i][$j]][$pathPerVehicle[$i][$j+1]];
						}
						$currentDistance += $distanceDepotFromLocations[$pathPerVehicle[$i][0]];
						$currentDistance += $distanceDepotFromLocations[$pathPerVehicle[$i][count($pathPerVehicle[$i])-1]];
					 	$currentDistanceForAllVehicle += $currentDistance;
					 	array_push($pathPerVehicle[$i], $currentDistance);
					}
			}

			if ($bestDistance > $currentDistanceForAllVehicle) {
					$bestDistance = $currentDistanceForAllVehicle;
					$goodsPerVehiles = $pathPerVehicle;
				}

			 }
		}
		$vehiclesIndex = $vi;
	}

	//return (str(bestDistance)+"|"+str(goodsPerVehiles))
	return $goodsPerVehiles;
}


function swap($i, $j, $permutation) {
	$tmp = $permutation[$i];
	$permutation[$i] = $permutation[$j];
	$permutation[$j] = $tmp;

	return $permutation;
}

function generateRandomPermutation($permutation) {
	

	$n = count($permutation);

	if ($n == 1) {
		return $permutation;
	}

	$a = rand(0, $n-1);
	do {
	  $b = rand(0, $n-1);
	} while ($a == $b);

	$permutation = swap($a, $b, $permutation);
	return $permutation;
}

function getResult($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations) {

	$k = fillVehicle($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity);	

	for ($i = 0; $i < count($k); $i++) {
		$distance = 0;
		$cur = $k[$i];
		if (count($cur) != 0) {
			for ($j = 0; $j < count($cur)-1; $j++) {
				$distance += $distanceBetweenLocations[$cur[$j]][$cur[$j+1]];
			}
			$distance += $distanceDepotFromLocations[$cur[0]];
			$distance += $distanceDepotFromLocations[$cur[count($cur)-1]];
			array_push($k[$i], $distance);
		}
	}

	return $k;
}


function getDistance($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations) {

	$k = fillVehicle($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity);	

	if ($k == -1) {
		return -1;
	}

	$distance = 0;

	for ($i = 0; $i < count($k); $i++) {
		$cur = $k[$i];
		if (count($cur) != 0) {
			for ($j = 0; $j < count($cur)-1; $j++) {
				$distance += $distanceBetweenLocations[$cur[$j]][$cur[$j+1]];
			}
			$distance += $distanceDepotFromLocations[$cur[0]];
			$distance += $distanceDepotFromLocations[$cur[count($cur)-1]];
			array_push($k[$i], $distance);
		}
	}

	return $distance;
}

function SA($locationsIndex, $distanceBetweenLocations, $distanceDepotFromLocations, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity)
{
	$currentTemperature = 100.0;
	$coolingRate = 0.9999;
	$minimalTemperature = 0.0001;
	$candidate = $locationsIndex;

	do {
	  $dCandidate = fillVehicle($candidate, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity);
	  $candidate = generateRandomPermutation($candidate);
	} while ($dCandidate == -1);

	while ($currentTemperature > $minimalTemperature)
	{
		$dCandidate = getDistance($candidate, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);
		$randomCandidate = generateRandomPermutation($candidate);
		$dRandomCandidate = getDistance($randomCandidate, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);
		
		if ($dRandomCandidate != -1) {

			if ($dRandomCandidate < $dCandidate) {
				$candidate = $randomCandidate;
			}
			else {
				$E = $dCandidate - $dRandomCandidate;
				$T = $currentTemperature;
				$random = rand(0,100)/100;
				if ($random < (exp($E/$T))) {
					$candidate = $randomCandidate;
				}
			}
		}

		$currentTemperature = $currentTemperature * $coolingRate;
	}
	$result = getResult($candidate, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);
	return $result;
}

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

for($i=0; $i<count($distanceBetweenLocations); $i++) {
	array_push($locationsIndex, $i);
}

$distanceDepotFromLocations = json_decode($depot);
$goodsPerLocations = json_decode($goodsPerLocation);
$vehiclesCapacity = json_decode($vehicles);

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
	$r = json_encode($result);
	echo $r;
}

?>