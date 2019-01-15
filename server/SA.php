<?php

function SA($locationsIndex, $distanceBetweenLocations, $distanceDepotFromLocations, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity)
{

    $currentTemperature = 100.0;
    $coolingRate = 0.9999;
    $minimalTemperature = 0.0001;
$i = 0;
    $candidate = $locationsIndex;
    shuffle($candidate);
    $dCandidate = callGetDistance($candidate, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);

    if ($dCandidate == -1) {
        $dCandidate = 999999;
    }

    while ($currentTemperature > $minimalTemperature) {
        $randomCandidate = generateRandomPermutation($candidate);
        $dRandomCandidate = callGetDistance($randomCandidate, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);
        if ($dRandomCandidate != - 1) {
            
            if ($dRandomCandidate < $dCandidate) {
                $candidate = $randomCandidate;
                $dCandidate = $dRandomCandidate;
            }
            else {
                $E = $dCandidate - $dRandomCandidate;
                $T = $currentTemperature;
                $random = rand(0, 100) / 100;
                if ($random < (exp($E / $T))) {
                    $candidate = $randomCandidate;
                    $dCandidate = $dRandomCandidate;
                }
            }
        }
//115123
        $currentTemperature = $currentTemperature * $coolingRate;
        $i++;
    }

    // $newVehicleIndex = getNewVehicleIndex($candidate, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);

    // $result = getResult($candidate, $goodsPerLocations, $newVehicleIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);
     print_r($i);
}

?>
