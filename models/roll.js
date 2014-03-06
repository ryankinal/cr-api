var validTypes = [2, 4, 6, 8, 10, 12, 20, 30, 100];

module.exports = {
	init: function(type, value, certified) {
		var config;

		if (typeof type === 'Object')
		{
			config = type;
		}
		else
		{
			config = {
				type: type,
				certified: certified,
				value: value
			};
		}

		if (validTypes.indexOf(config.type) === -1 && !(/^10{2,}$/.test(config.type)))
		{
			throw('Invalid die type');
		}

		if (config.value > config.type)
		{
			throw('The value of a roll may not be greater than its type');
		}

		this.type = config.type;
		this.value = config.value;
		this.certified = config.certified;
		this.dateAdded = config.dateAdded || undefined;
		this.used = config.used || false;
		this.dateUsed = config.dateUsed || undefined;
	}
};