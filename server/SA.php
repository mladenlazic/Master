<?php

function SA($locationsIndex, $distanceBetweenLocations, $distanceDepotFromLocations, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity)
{

    $currentTemperature = 100.0;
    $coolingRate = 0.99;
    $minimalTemperature = 0.0001;

    $t = time() + 600;

    $candidate = $locationsIndex;
    shuffle($candidate);
    $dCandidate = getDistance($candidate, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);

    if ($dCandidate == -1) {
        $dCandidate = 999999;
    }

    while ($currentTemperature > $minimalTemperature && $t > time()) {
        $randomCandidate = generateRandomPermutation($candidate);
        $dRandomCandidate = getDistance($randomCandidate, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);
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
        $currentTemperature = $currentTemperature * $coolingRate;
    }

    $theBestVehicleIndexPermutation = getTheBestVehicleIndexPermutation($candidate, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);

    $result = getResult($candidate, $goodsPerLocations, $theBestVehicleIndexPermutation, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);

    return $result;
}

?>
