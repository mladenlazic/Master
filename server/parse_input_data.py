import sys
import json

import utils

def parseVehicleToArray(vehicles):

	vehiclesCapacity = []
	json_vehicle = json.loads(vehicles)

	for i in json_vehicle['vehicles']:
		vehiclesCapacity.append(int(i['capacity']))

	return vehiclesCapacity;

def parseLocationToMatrix(locations):
	distanceBetweenLocations = []

	json_locations = json.loads(locations)
	numberOfLocations = len(json_locations)

	for i in range(numberOfLocations):
		row = []
		for j in range(numberOfLocations):
			row.append(json_locations[i][j])
		distanceBetweenLocations.append(row)

	return distanceBetweenLocations

def getLocationIndex(locations):
	locationsIndex = []

	numberOfLocations = len(locations)

	for i in range(numberOfLocations):
		locationsIndex.append(i)

	return locationsIndex

def getGoodsPerLocation(locationsGoods):
	goodsPerLocations = []

	json_goodsPerLocation = json.loads(locationsGoods)
	numberOfLocations = len(json_goodsPerLocation)

	for i in range(numberOfLocations):
		goodsPerLocations.append(int(json_goodsPerLocation[i]))

	return goodsPerLocations;

def parseDepotDistanceToArray(depot):
	distanceDepotFromLocations = []

	json_depot = json.loads(depot)
	numberOfLocations = len(json_depot)

	for i in range(numberOfLocations):
		distanceDepotFromLocations.append(json_depot[i])

	return distanceDepotFromLocations
