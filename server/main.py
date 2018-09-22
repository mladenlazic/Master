import sys

import parse_input_data

from VRPBruteForceAlgorithm import VRPBruteForce
from VRPSimulatedAnnealingAlgorithm import VRPSimulatedAnnealing

locations = sys.argv[1]
depot = sys.argv[2]
vehicles = sys.argv[3]
method = sys.argv[4]
locationsGoods = sys.argv[5]



#matrix
# 0 2 3
# 2 0 4
# 3 4 0
#first row and column are depot
distanceBetweenLocations = parse_input_data.parseLocationToMatrix(locations)
# [12,45.54] how much depot away from each delivery locatoins
distanceDepotFromLocations = parse_input_data.parseDepotDistanceToArray(depot)
# v = [20,30]
vehiclesIndex = parse_input_data.parseVehicleIndexToArray(vehicles)
# v = [0, 1]
vehiclesCapacity = parse_input_data.parseVehicleCapacityToArray(vehicles)
# g = [10,20,30]
goodsPerLocations = parse_input_data.getGoodsPerLocation(locationsGoods)
# l = [1,2,3] because on first location is depot
locationsIndex = parse_input_data.getLocationIndex(goodsPerLocations)

if(method == "BF"):
	result = VRPBruteForce(locationsIndex, distanceBetweenLocations, distanceDepotFromLocations, goodsPerLocations, vehiclesIndex, vehiclesCapacity)
	print(result)
else:
	result = VRPSimulatedAnnealing(locationsIndex, distanceBetweenLocations, distanceDepotFromLocations, goodsPerLocations, vehiclesCapacity)
	print(result)
