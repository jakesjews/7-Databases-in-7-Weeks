var map = function() {

	var number = this.components.number + '',
		seen = [],
		result = [],
		i = number.length;

	while (i--) {
		seen[+number[i]] = 1;
	}

	for (i=0; i < 10; i++) {
		if (seen[i]) {
			result[result.length] = i;
		}
	}

	emit({ digits: result, country: this.components.country}, {count: 1});
};

var reduce = function(key, values) {
	var total = 0;
	for(var i=0; i < values.length; i++) {
		total += values[i].count;
	}

	return { count: total };
};

var finalize = function (key, reducedValue) {
	reducedValue.total = reducedValue.count;
	return reducedValue;
};

results = db.runCommand({
	mapReduce: 'phones',
	map: map,
	reduce: reduce,
	finalize: finalize,
	out: 'phones.report'
});