var london = db.cities.find({name: "London", country: "GB"})[0];

db.runCommand({
	geoNear: "cities",
	near: [ london.location.latitude, london.location.longitude],
	spherical: true,
	distanceMultiplier: 3963.192,
	maxDistance: 50
});