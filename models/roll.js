var config = require('../config');

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

		roll.type = parseInt(roll.type, 10);
		roll.value = parseInt(roll.value, 10);

		if (typeof roll.certified === 'string') {
			if (roll.certified === 'true') {
				roll.certified = true;
			} else {
				roll.certified = false;
			}
		}

		/*if (config.validTypes.indexOf(roll.type) === -1 && !(/^10{2,}$/.test(roll.type)))
		{
			throw(new Error('Invalid die type'));
		}

		if (roll.value > roll.type)
		{
			throw(new Error('The value of a roll may not be greater than its type'));
		}*/

		if (roll.id) {
			this.id = roll.id;
		} else if (roll._id) {
			this.id = roll._id;
		}

		if (this._id) {
			delete this._id;
		}

		this.type = roll.type;
		this.value = parseInt(roll.value, 10);
		this.certified = roll.certified;
		this.dateAdded = roll.dateAdded || undefined;
		this.used = roll.used || false;
		this.dateUsed = roll.dateUsed || undefined;
	}
};