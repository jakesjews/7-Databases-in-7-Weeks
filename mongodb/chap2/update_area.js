update_area = function() {
	db.phones.find().forEach(
		function(phone) {
			phone.components.area++;
			phone.display = "+" +
				phone.components.country + " " +
				phone.components.area + "-" +
				phone.components.number;
			db.phone.update({_id: phone._id}, phone, false);
		}
	)
}