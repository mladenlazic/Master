<?php

function SA($locationsIndex, $distanceBetweenLocations, $distanceDepotFromLocations, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity)
{
    $currentTemperature = 100.0;
    $coolingRate = 0.9999;
    $minimalTemperature = 0.0001;
    $candidate = generateRandomPermutation($locationsIndex);
    while ($currentTemperature > $minimalTemperature) {
        $dCandidate = getDistance($candidate, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);
        $randomCandidate = generateRandomPermutation($candidate);
        $dRandomCandidate = getDistance($randomCandidate, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);
        if ($dRandomCandidate != - 1) {
            if ($dRandomCandidate < $dCandidate) {
                $candidate = $randomCandidate;
            }
            else {
                $E = $dCandidate - $dRandomCandidate;
                $T = $currentTemperature;
                $random = rand(0, 100) / 100;
                if ($random < (exp($E / $T))) {
                    $candidate = $randomCandidate;
                }
            }
        }

        $currentTemperature = $currentTemperature * $coolingRate;
    }

    $result = getResult($candidate, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity, $distanceBetweenLocations, $distanceDepotFromLocations);
    return $result;
}

?>
