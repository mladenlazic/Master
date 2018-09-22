import utils
import copy

def VRPBruteForce(locations, distanceBetweenLocations, distanceDepotFromLocations, goodsPerLocations, vehiclesCapacity):

	# print(locations)
	bestDistance = 99999999
	bestPermutation = "N/A"
	goodsPerVehiles = "N/A"
	
	numberOfLocations = len(locations)
	numberOfPermutation = utils.factorial(numberOfLocations)

	while(numberOfPermutation):
		utils.nextPermutation(locations, numberOfLocations-1)
		pathPerVehicle=utils.fillVehicle(locations, goodsPerLocations, vehiclesCapacity);
		
		currentDistanceForAllVehicle = 0
		if (pathPerVehicle != -1):
			
			for i in range(len(pathPerVehicle)):
				
				# ako je samo vozilo u nizu -> preskoci
				if (len(pathPerVehicle[i]) == 1):
					continue

				currentDistance = 0
				#uzmemo samo lokacije bez vozila
				tmp = pathPerVehicle[i][1:]
				
				for j in range(len(tmp)-1):
					currentDistance += distanceBetweenLocations[tmp[j]][tmp[j+1]]
				currentDistance += distanceDepotFromLocations[tmp[0]]
				currentDistance += distanceDepotFromLocations[tmp[len(tmp)-1]]
				currentDistanceForAllVehicle += currentDistance
				pathPerVehicle[i].insert(1, currentDistance)
				tmp = []
			if (bestDistance > currentDistanceForAllVehicle):
				bestDistance = currentDistanceForAllVehicle
				goodsPerVehiles = pathPerVehicle[:]
				
		numberOfPermutation = numberOfPermutation - 1

	result = str(bestDistance) + "|" + str(goodsPerVehiles)


	return result
