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

def fillVehicle(locations, goodsPerLocations, vehicleIndex, vehiclesCapacity):
	numberOfLocations = len(locations)
	numberOfVehicles = len(vehiclesCapacity)

	if (numberOfLocations <= 0 and numberOfVehicles <= 0):
		return -1

	pathPerVehicle = [];

	for i in range(numberOfVehicles):
		pathPerVehicle.append([vehicleIndex[i]])

	vehicleNumber = 0;
	locationNumber = 0;
	currentVehicleFreeCapacity = vehiclesCapacity[vehicleIndex[vehicleNumber]];
	sumOfGoodsPerLocations = sum(goodsPerLocations)

	while (sumOfGoodsPerLocations):

		if(vehicleNumber == numberOfVehicles):
			return -1

		goods = goodsPerLocations[locations[locationNumber]]

		if(goods <= currentVehicleFreeCapacity):
			sumOfGoodsPerLocations -= goodsPerLocations[locations[locationNumber]]
			currentVehicleFreeCapacity -= goodsPerLocations[locations[locationNumber]]
			pathPerVehicle[vehicleNumber].append(locations[locationNumber])
			locationNumber += 1
		else:
			vehicleNumber += 1
			if (vehicleNumber != numberOfVehicles):
				currentVehicleFreeCapacity = vehiclesCapacity[vehicleIndex[vehicleNumber]];

	return pathPerVehicle
