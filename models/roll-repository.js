var q = require('q'),
	config = require('../config-test'),
	MongoClient = require('mongodb').MongoClient,
	ObjectId = require('mongodb').ObjectID,
	rollProto = require('./roll');

module.exports = {
	validate: function(roll) {
		var keys = Object.keys(roll),
			missing = ['type', 'value', 'certified'].filter(function(field) {
				return keys.indexOf(field) === -1;
			});

		if (missing.length > 0) {
			console.log('Missing required fields: ' + missing.join(', '));
			return false;
		}

		if (roll.value < 1 || roll.value > roll.type) {
			console.log('Roll value outside of bounds: 1 to ' + roll.type);
			return false;
		}

		if (roll.used && !roll.dateUsed) {
			console.log('Roll is used, but date used is not set');
			return false;
		}

		if (roll.id && !roll.dateAdded) {
			console.log('Roll has ID, but does not have dateAdded');
			return false;
		}

		if (roll.dateAdded && roll.dateAdded > Date.now()) {
			console.log('Roll was added in the future');
			return false;
		}

		if (config.validTypes.indexOf(roll.type) === -1 && !(/^10{2,}$/.test(roll.type))) {
			console.log('Roll has an invalid type');
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
				db.collection('rolls').find({ _id: ObjectId(id) }).next(function(err, obj) {
					if (err || !obj) {
						deferred.reject(err);
					} else {
						var roll = Object.create(rollProto);
						roll.init(obj);
						deferred.resolve(roll);
					}
				});
			}
		});

		return deferred.promise;
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
							}, function(err) {
								deferred.reject(err);
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
				if (err) {
					deferred.reject(err)
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