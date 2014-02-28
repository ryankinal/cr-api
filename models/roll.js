var validTypes = [2, 4, 6, 8, 10, 12, 20, 30, 100];

module.exports = {
	init: function(type, value, certified) {
		if (validTypes.indexOf(type) === -1 && !(/^10{2,}$/.test(type)))
		{
			throw('Invalid die type');
		}

		this.type = type;
		this.value = value;
		this.used = false;
		this.certified = certified;
		this.dateAdded = Date.now();
	}
};