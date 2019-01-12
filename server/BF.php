<?php

function BF($locations, $distanceBetweenLocations, $distanceDepotFromLocations, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity)
{
    $end_time = time() + 3600;
    $time_is_up = false;

    $bestDistance = 99999999;
    $goodsPerVehiles = - 1;
    $loc = $locations;
    $vi = $vehiclesIndex;
    $numberOfPermutationLocation = factorial(count($locations));
    $numberOfPermutationVehicle = factorial(count($vehiclesIndex));
    for ($l = 0; $l < $numberOfPermutationLocation; $l++) {
        if ($l != 0) {
            $locations = nextPermutation($locations);
        }

        for ($k = 0; $k < $numberOfPermutationVehicle; $k++) {
            if (time() >= $end_time) {
                $time_is_up = true;
                break;
            }
            if ($k != 0) {
                $vehiclesIndex = nextPermutation($vehiclesIndex);
            }

            $pathPerVehicle = fillVehicle($locations, $goodsPerLocations, $vehiclesIndex, $vehiclesCapacity);
            $currentDistanceForAllVehicle = 0;
            if ($pathPerVehicle != - 1) {
                for ($i = 0; $i < count($pathPerVehicle); $i++) {

                    // if there is only one vehicle in array than skip

                    if (count($pathPerVehicle[$i]) != 0) {
                        $currentDistance = 0;

                        // uzmemo samo lokacije bez vozila

                        for ($j = 0; $j < count($pathPerVehicle[$i]) - 1; $j++) {
                            $currentDistance+= $distanceBetweenLocations[$pathPerVehicle[$i][$j]][$pathPerVehicle[$i][$j + 1]];
                        }

                        $currentDistance+= $distanceDepotFromLocations[$pathPerVehicle[$i][0]];
                        $currentDistance+= $distanceDepotFromLocations[$pathPerVehicle[$i][count($pathPerVehicle[$i]) - 1]];
                        $currentDistanceForAllVehicle+= $currentDistance;
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

        if ($time_is_up == true) {
            break;
        }
    }

    return $goodsPerVehiles;
}

?>
