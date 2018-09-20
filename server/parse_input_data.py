import sys
import json

locations = sys.argv[1]
vehicles = sys.argv[2]
method = sys.argv[3]
locationsGoods = sys.argv[4]

DEFINE_KILOMETER = 1000.0

def nextPermutation(locations, numberOfLocations):
	k = numberOfLocations - 1
	while (locations[k] > locations[k+1]):
		k = k - 1
	j = numberOfLocations
	while (locations[k] > locations[j]):
		j = j - 1
	swap(j, k, locations)
	r = numberOfLocations
	s = k + 1
	while (r > s):
		swap(r,s,locations);
		r = r - 1
		s = s + 1

def swap(i, j, locations):
	temp = locations[i]
	locations[i] = locations[j]
	locations[j] = temp

def factorial(number):
    if number == 0:
        return 1
    else:
        return number * factorial(number-1)

def fillVehicle(locations, locationsGoods, vehiclesCapacity):
	numberOfLocations = len(locations)
	numberOfVehicles = len(vehiclesCapacity)
	sumOfLocationsGoods = sum(locationsGoods)

	vehicleNumber = 0;
	locationNumber = 0;

	if (numberOfLocations <= 0 and numberOfVehicles <= 0):
		return -1

	currentVehicleFreeCapacity = vehiclesCapacity[vehicleNumber];
	pathPerVehicle = [];

	for i in range(numberOfVehicles):
		vehicle = "v" + str(i)
		pathPerVehicle.append([vehicle])

	while (sumOfLocationsGoods != 0):
		# print("vehicle " + str(vehicleNumber))
		# print("location " + str(locationNumber))

		if(vehicleNumber == numberOfVehicles):
			return -1

		goods = locationsGoods[locations[locationNumber]-1]
		if(goods <= currentVehicleFreeCapacity):
			sumOfLocationsGoods -= locationsGoods[locations[locationNumber]-1]
		#	print(sumOfLocationsGoods);

			currentVehicleFreeCapacity -= locationsGoods[locations[locationNumber]-1]
			pathPerVehicle[vehicleNumber].append(locations[locationNumber])
			locationNumber += 1
		else:
			vehicleNumber += 1
			if (vehicleNumber != numberOfVehicles):
				currentVehicleFreeCapacity = vehiclesCapacity[vehicleNumber];

	return pathPerVehicle

def VRPBruteForce(locations, distanceBetweenLocations, goodsPerLocations, vehiclesCapacity):

	# print(locations)
	bestDistance = 99999999
	bestPermutation = "N/A"
	goodsPerVehiles = "N/A"

	numberOfLocations = len(locations)
	numberOfPermutation = factorial(numberOfLocations)

	while(numberOfPermutation):
		nextPermutation(locations, numberOfLocations-1)
		pathPerVehicle=fillVehicle(locations, goodsPerLocations, vehiclesCapacity);
		# print(pathPerVehicle);

		currentDistanceForAllVehicle = 0
		if (pathPerVehicle != -1):
			for i in range(len(pathPerVehicle)):
				currentDistance = 0
				tmp = pathPerVehicle[i][1:]
				for j in range(len(tmp)-1):
					currentDistance += distanceBetweenLocations[tmp[j]][tmp[j+1]]
				currentDistance += distanceBetweenLocations[0][tmp[0]]
				currentDistance += distanceBetweenLocations[tmp[len(tmp)-1]][0]
				currentDistanceForAllVehicle += currentDistance
				tmp = []
			if (bestDistance > currentDistanceForAllVehicle):
				bestDistance = currentDistanceForAllVehicle
				goodsPerVehiles = pathPerVehicle[:]

		numberOfPermutation = numberOfPermutation - 1

	print("DUZINA " + str(bestDistance) + " VOZILA " + str(goodsPerVehiles))
def VRPSimulatedAnnealing(locations, distanceBetweenLocations, goodsPerLocations, vehiclesCapacity):
	print("TODO")

def parseVehicleToArray(vehicles):

	vehiclesCapacity = []
	json_vehicle = json.loads(vehicles)

	for i in json_vehicle['vehicles']:
		vehiclesCapacity.append(int(i['capacity']))

	return vehiclesCapacity;

def parseLocationToMatrix(locations):
	distanceBetweenLocations = []

	json_locations = json.loads(locations)
	numberOfLocations = len(json_locations['rows'])

	row = []
	for i in range(numberOfLocations):
		for j in range(numberOfLocations):
			km = int(json_locations['rows'][i]['elements'][j]['distance']['value'])
			row.append(km/DEFINE_KILOMETER)
		distanceBetweenLocations.append(row)
		row = []

	return distanceBetweenLocations

def getLocationIndex(locations):
	locationsIndex = []

	numberOfLocations = len(locations)

	for i in range(numberOfLocations):
		locationsIndex.append(i+1)

	return locationsIndex

def getGoodsPerLocation(locationsGoods):
	goodsPerLocations = []

	json_goodsPerLocation = json.loads(locationsGoods)
	numberOfLocations = len(json_goodsPerLocation)

	for i in range(numberOfLocations):
		goodsPerLocations.append(int(json_goodsPerLocation[i]))

	return goodsPerLocations;

#main

#matrix
# 0 2 3
# 2 0 4
# 3 4 0
#first row and column are depot
distanceBetweenLocations = parseLocationToMatrix(locations)
# v = [20,30]
vehiclesCapacity = parseVehicleToArray(vehicles)
# g = [10,20,30]
goodsPerLocations = getGoodsPerLocation(locationsGoods);
# l = [1,2,3] because on first location is depot
locationsIndex = getLocationIndex(goodsPerLocations)

if(method == "BF"):
	VRPBruteForce(locationsIndex, distanceBetweenLocations, goodsPerLocations, vehiclesCapacity)
else:
	VRPSimulatedAnnealing(locationsIndex, distanceBetweenLocations, goodsPerLocations, vehiclesCapacity)
