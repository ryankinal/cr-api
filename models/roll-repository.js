var q = require('q'),
	config = require('../config'),
	MongoClient = require('mongodb').MongoClient,
	ObjectId = require('mongodb').ObjectID,
	rollProto = require('./roll');

module.exports = {
	validate: function(roll) {
		var keys = Object.keys(roll),
			missing = ['type', 'value', 'certified'].filter(function(field) {
				return keys.indexOf(field) === -1;
			}),
			errors = [];

		if (missing.length > 0) {
			errors.push('Missing required fields: ' + missing.join(', '));
		}

		if (roll.value < 1 || roll.value > roll.type) {
			errors.push('Roll value outside of bounds: 1 to ' + roll.type);
		}

		if (roll.used && !roll.dateUsed) {
			errors.push('Roll is used, but date used is not set');
		}

		if (roll.id && !roll.dateAdded) {
			errors.push('Roll has ID, but does not have dateAdded');
		}

		if (roll.dateAdded && roll.dateAdded > Date.now()) {
			errors.push('Roll was added in the future');
		}

		if (config.validTypes.indexOf(roll.type) === -1 && !(/^10{2,}$/.test(roll.type))) {
			errors.push('Roll has an invalid type');
		}

		if (typeof roll.certified !== 'boolean') {
			errors.push('Roll must have a boolean true/false property "certified"');
		}

		if (typeof roll.used !== 'boolean') {
			errors.push('Roll must have a boolean property "used"');
		}

		return errors;
	},
	get: function(id) {
		var deferred = q.defer();

		MongoClient.connect(config.database.connectionString(), function(err, db) {
			if (err) {
				deferred.reject(new Error('Database connection failed'));
			} else {
				db.collection('rolls').find({ _id: ObjectId(id) }).next(function(err, obj) {
					if (err || !obj) {
						deferred.reject(err);
						db.close();
					} else {
						var roll = Object.create(rollProto);
						roll.init(obj);
						deferred.resolve(roll);

						db.close();
					}
				});
			}
		});

		return deferred.promise;
	},
	getMany: function(ids) {
		if (ids.forEach) {
			var deferred = q.defer();

			MongoClient.connect(config.database.connectionString(), function(err, db) {
				if (err) {
					deferred.reject(new Error('Database connection failed'));
				} else {
					db.collection('rolls').find({ _id: { $in: ids.map(ObjectId) }}, function(err, obj) {
						if (err || !obj) {
							deferred.reject(err);
						} else {
							var results = obj.toArray(function(err, results) {
								if (err || !results) {
									deferred.reject('No results for specified ids');
									db.close();
								} else {
									deferred.resolve(results.map(function(item) {
										var roll = Object.create(rollProto);
										roll.init(item);
										return roll;
									}));

									db.close();
								}
							});
						}
					});
				}
			});

			return deferred.promise;
		} else {
			return this.get(ids);
		}
	},
	getRandom: function(type) {
		var deferred = q.defer(),
			repo = this;

		MongoClient.connect(config.database.connectionString(), function(err, db) {
			if (err) {
				deferred.reject(new Error('Database connection failed'));
			} else {
				db.collection('rolls').find({ type: type, used: false }).count(function(err, count) {
					db.collection('rolls').find({ type: type, used: false }).limit(-1).skip(Math.floor(Math.random() * count)).next(function(err, obj) {
						if (err || !obj) {
							deferred.reject(err);
						} else {
							var roll = Object.create(rollProto);
							roll.init(obj);
							roll.used = true;
							roll.dateUsed = Date.now();

							repo.update(roll).then(function(roll) {
								deferred.resolve(roll);
								db.close();
							}, function(err) {
								deferred.reject(err);
								db.close();
							});
						}
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
		var deferred = q.defer(),
			newRoll = Object.create(rollProto),
			errors;

		newRoll.init(roll);
		newRoll.dateAdded = Date.now();
		errors = this.validate(newRoll);

		if (errors.length) {
			deferred.reject(new Error("Invalid roll: " + errors.join(', ')));
		} else if (newRoll.certified !== true) {
			deferred.reject(new Error('Your roll must have a certified value of boolean true'))
		} else {
			MongoClient.connect(config.database.connectionString(), function(err, db) {
				if (err) {
					deferred.reject(err);
					db.close();
				} else {
					db.collection('rolls').insert(newRoll, function(err, objects) {
						if (err) {
							deferred.reject(err);
						} else {
							newRoll.init(objects[0]);
							deferred.resolve(newRoll);
							db.close();
						}
					});
				}
			});
		}

		return deferred.promise;
	},
	update: function(roll) {
		var deferred = q.defer(),
			errors = this.validate(roll);

		if (errors.length) {
			deferred.reject(new Error('Invalid roll: ' + errors.join(', ')));
		} else {
			MongoClient.connect(config.database.connectionString(), function(err, db) {
				if (err) {
					deferred.reject(err)
					db.close();
				} else {
					var id = roll.id;
					delete roll.id;
					db.collection('rolls').update({ _id: id }, roll, function(err, count) {
						if (err || count === 0) {
							deferred.reject(err);
						} else {
							var newRoll = Object.create(rollProto);
							newRoll.init(roll);
							newRoll.id = id;
							deferred.resolve(newRoll);
							db.close();
						}
					});
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