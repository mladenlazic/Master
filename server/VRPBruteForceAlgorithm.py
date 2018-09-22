import utils

def VRPBruteForce(locations, distanceBetweenLocations, distanceDepotFromLocations, goodsPerLocations, vehicleIndex, vehiclesCapacity):

	bestDistance = 99999999
	goodsPerVehiles = "N/A"
	
	numberOfPermutationLocation = utils.factorial(len(locations))
	numberOfPermutationVehicle = utils.factorial(len(vehicleIndex))

	for l in range(numberOfPermutationVehicle):
		utils.nextPermutation(vehicleIndex, len(vehicleIndex)-1)
		

		for k in range(numberOfPermutationLocation):

			utils.nextPermutation(locations, len(locations)-1)

			pathPerVehicle = utils.fillVehicle(locations, goodsPerLocations, vehicleIndex, vehiclesCapacity);

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

				if (bestDistance > currentDistanceForAllVehicle):
					bestDistance = currentDistanceForAllVehicle
					goodsPerVehiles = pathPerVehicle[:]

	return (str(bestDistance)+"|"+str(goodsPerVehiles))
