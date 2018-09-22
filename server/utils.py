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
		vehicle = i
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
