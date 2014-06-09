var q = require('q'),
	config = require('../config'),
	MongoClient = require('mongodb').MongoClient;

module.exports = {
	byType: function() {
		var deferred = q.defer();

		MongoClient.connect(config.database.connectionString(), function(err, db) {
			if (err) {
				deferred.reject(new Error('Database connection failed'));
			} else {
				db.collection('rolls').aggregate([
						{ $group: { _id: { type: '$type', used: '$used' }, count: { $sum: 1 }}}
					],
					function(err, obj) {
						var ret = {};

						if (err || !obj) {
							deferred.reject(err);
						} else {
							obj.forEach(function(stat) {
								if (typeof ret[stat._id.type] === 'undefined') {
									ret[stat._id.type] = {
										total: 0,
										used: 0,
										unused: 0
									};
								}

								if (stat._id.used) {
									ret[stat._id.type]['used'] += stat.count;
								} else {
									ret[stat._id.type]['unused'] += stat.count;
								}
								
								ret[stat._id.type].total += stat.count;
							})

							deferred.resolve(ret);
						}
					}
				);
			}
		});

		return deferred.promise;
	}	
}