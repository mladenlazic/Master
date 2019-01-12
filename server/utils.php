<?php

function factorial($number)
{
    if ($number == 0) {
        return 1;
    }
    else {
        return $number * factorial($number - 1);
    }
}

function nextPermutation($array)
{

    // Find longest non-increasing suffix

    $i = count($array) - 1;
    while ($i > 0 && $array[$i - 1] >= $array[$i]) $i--;

    // Now i is the head index of the suffix
    // Are we at the last permutation already?

    if ($i <= 0) return -1;

    // Let array[i - 1] be the pivot
    // Find rightmost element that exceeds the pivot

    $j = count($array) - 1;
    while ($array[$j] <= $array[$i - 1]) $j--;

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

function getDistance($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations)
{

    $numberOfPermutationVehicle = factorial(count($vehicleIndex));
    
    // Assume that solution will not be bigger than 99999999
    $distance = 99999999;

    for ($k = 0; $k < $numberOfPermutationVehicle; $k++) {
        if ($k != 0) {
            $vehicleIndex = nextPermutation($vehicleIndex);
        }

        // Calculate new solution
        $newDistance = getDistanceForCurrentVehiclePermutation($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);

        // If new solution is not acceptable
        if ($newDistance == -1)
            continue;

        // If new solution better than old
        if ($newDistance < $distance) {
            $distance = $newDistance;
        }
    }
        

    // If solution is not acceptable
    if($distance == 99999999)
        return -1;
    
    // Return the best solution
    return $distance;
}    


function getTheBestVehicleIndexPermutation($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations)
{

    $numberOfPermutationVehicle = factorial(count($vehicleIndex));
    $v = $vehicleIndex;
    $distance = 99999999;
    for ($k = 0; $k < $numberOfPermutationVehicle; $k++) {
        if ($k != 0) {
            $vehicleIndex = nextPermutation($vehicleIndex);
        }

        $newDistance = getDistanceForCurrentVehiclePermutation($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);



        if ($newDistance == -1)
            continue;


        if ($newDistance < $distance) {
            $distance = $newDistance;
            $v = $vehicleIndex;
        }
    }
        
    return $v;
}    

function fillVehicle($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity)
{
    $numberOfLocations = count($locations);
    $numberOfVehicles = count($vehiclesCapacity);
    if ($numberOfLocations <= 0 and $numberOfVehicles <= 0) {
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
    while ($sumOfGoodsPerLocations) {
        if ($vehicleNumber == $numberOfVehicles) {
            return -1;
        }

        $goods = $goodsPerLocations[$locations[$locationNumber]];
        if ($goods <= $currentVehicleFreeCapacity) {
            $sumOfGoodsPerLocations-= $goodsPerLocations[$locations[$locationNumber]];
            $currentVehicleFreeCapacity-= $goodsPerLocations[$locations[$locationNumber]];
            array_push($pathPerVehicle[$vehicleIndex[$vehicleNumber]], $locations[$locationNumber]);
            $locationNumber+= 1;
        }
        else {
            $vehicleNumber+= 1;
            if ($vehicleNumber != $numberOfVehicles) {
                $currentVehicleFreeCapacity = $vehiclesCapacity[$vehicleIndex[$vehicleNumber]];
            }
        }
    }

    return $pathPerVehicle;
}

function swap($i, $j, $permutation)
{
    $tmp = $permutation[$i];
    $permutation[$i] = $permutation[$j];
    $permutation[$j] = $tmp;
    return $permutation;
}

function generateRandomPermutation($permutation)
{
    $i = 0;
    $n = count($permutation);
    if ($n == 1) {
        return $permutation;
    }
    else if ($n == 2) {
        $i = 0;
    }
    else {
        $i = rand(0, $n - 2);
    }

    $permutation = swap($i, $i+1, $permutation);

    return $permutation;
}

function getResult($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations)
{
    $k = fillVehicle($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity);
    for ($i = 0; $i < count($k); $i++) {
        $distance = 0;
        $cur = $k[$i];
        if (count($cur) != 0) {
            for ($j = 0; $j < count($cur) - 1; $j++) {
                $distance+= $distanceBetweenLocations[$cur[$j]][$cur[$j + 1]];
            }

            $distance+= $distanceDepotFromLocations[$cur[0]];
            $distance+= $distanceDepotFromLocations[$cur[count($cur) - 1]];
            array_push($k[$i], $distance);
        }
    }

    return $k;
}

function getDistanceForCurrentVehiclePermutation($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations)
{
    $k = fillVehicle($locations, $goodsPerLocations, $vehicleIndex, $vehiclesCapacity);
    if ($k == - 1) {
        return -1;
    }

    $distance = 0;
    for ($i = 0; $i < count($k); $i++) {
        $cur = $k[$i];
        if (count($cur) != 0) {
            for ($j = 0; $j < count($cur) - 1; $j++) {
                $distance+= $distanceBetweenLocations[$cur[$j]][$cur[$j + 1]];
            }

            $distance+= $distanceDepotFromLocations[$cur[0]];
            $distance+= $distanceDepotFromLocations[$cur[count($cur) - 1]];
            array_push($k[$i], $distance);
        }
    }

    return $distance;
}

?>
