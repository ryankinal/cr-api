var q = require('q'),
	config = require('../config-test'),
	MongoClient = require('mongodb').MongoClient;

module.exports = {
	validate: function(roll) {
		var keys = Object.keys(roll),
			missing = ['type', 'value', 'certified', 'used'].filter(function(field) {
				return keys.indexOf(field) === -1;
			});

		if (missing.length > 0) {
			return false;
		}

		if (roll.value < 1 || roll.value > roll.type) {
			return false;
		}

		if (roll.used && !roll.dateUsed) {
			return false;
		}

		if (roll.id && !roll.dateAdded) {
			return false;
		}

		if (roll.dateAdded && roll.dateAdded > Date.now()) {
			return false;
		}

		if (roll.validTypes.indexOf(roll.type) === -1 && !(/^10{2,}$/.test(config.type))) {
			return false;
		}

		return true;
	},
	get: function(id) {
		var deferred = q.defer();

		MongoClient.connect(config.database.connectionString(), function(err, db) {
			if (err) {
				deferred.reject(new Error('Database connection failed'));
			} else {
				db.collection('rolls').find({ _id: id }, function(err, obj) {
					if (err) {
						deferred.reject(err);
						MongoClient.close();
					}

					obj.toArray(function(err, arr) {
						deferred.resolve(arr[0]);
					});
				});
			}
		});

		return deferred.promise;
	},
	find: function() {
		var deferred = q.defer();
		return deferred.promise;
	},
	create: function(roll) {
		var deferred = q.defer();

		if (!this.validate(roll)) {
			deferred.reject(new Error('Invalid roll'));
		} else {
			MongoClient.connect(config.database.connectionString(), function(err, db) {
				if (err) {
					deferred.reject(err);
				} else {
					db.collection('rolls').insert(roll, function(err, objects) {
						if (err) {
							deferred.reject(err);
						} else {
							deferred.resolve(objects[0]);
						}

						db.close();
					});
				}
			});
		}

		return deferred.promise;
	},
	update: function(roll) {
		var deferred = q.defer();

		if (!this.validate(roll)) {
			deferred.reject(new Error('Invalid roll'));
		} else {
			MongoClient.connect(config.database.connectionString(), function(err, db) {
				console.log(err, db);
				if (err) {
					console.log(err);
					deferred.reject(err)
				} else {
					db.collection('rolls').update({ _id: roll.id }, roll, function(err, objects) {
						console.log(err, objects);
						if (err) {
							deferred.reject(err);
						} else {
							deferred.resolve(objects[0]);
						}
					})
				}
			});
		}

		return deferred.promise;
	},
	remove: function() {
		var deferred = q.defer();
		return deferred.promise;
	}
};