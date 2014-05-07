var config = require('../config-test');

module.exports = {
	init: function(type, value, certified) {
		var roll;

		if (typeof type === 'object')
		{
			roll = type;
		}
		else
		{
			roll = {
				type: type,
				certified: certified,
				value: value
			};
		}

		if (config.validTypes.indexOf(roll.type) === -1 && !(/^10{2,}$/.test(roll.type)))
		{
			throw(new Error('Invalid die type'));
		}

		if (roll.value > roll.type)
		{
			throw(new Error('The value of a roll may not be greater than its type'));
		}

		this.id = roll.id || roll._id || undefined;
		this.type = roll.type;
		this.value = roll.value;
		this.certified = roll.certified;
		this.dateAdded = roll.dateAdded || undefined;
		this.used = roll.used || false;
		this.dateUsed = roll.dateUsed || undefined;
	}
};