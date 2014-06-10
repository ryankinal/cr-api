var q = require('q'),
	config = require('../config'),
	MongoClient = require('mongodb').MongoClient;

module.exports = {
	total: function() {
		var deferred = q.defer();

		MongoClient.connect(config.database.connectionString(), function(err, db) {
			if (err) {
				deferred.reject(new Error('Database connection failed'));
				db.close();
			} else {
				db.collection('rolls').aggregate([
					{ $group: { _id: { used: '$used' }, count: { $sum: 1 }}}
				], function(err, obj) {
					var ret = {
						total: 0,
						used: 0,
						unused: 0
					};

					if (err || !obj) {
						deferred.reject(err);
						db.close();
					} else {
						obj.forEach(function(stat) {
							if (stat._id.used) {
								ret.used = stat.count;
							} else {
								ret.unused = stat.count;
							}

							ret.total = ret.unused + ret.used;
						});

						deferred.resolve(ret);
						db.close();
					}
				})
			}
		});

		return deferred.promise;
	},
	groupByType: function() {
		var deferred = q.defer();

		MongoClient.connect(config.database.connectionString(), function(err, db) {
			if (err) {
				deferred.reject(new Error('Database connection failed'));
				db.close();
			} else {
				db.collection('rolls').aggregate([
						{ $group: { _id: { type: '$type', used: '$used' }, count: { $sum: 1 }}}
					],
					function(err, obj) {
						var ret = {};

						if (err || !obj) {
							deferred.reject(err);
							db.close();
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
							});

							deferred.resolve(ret);
							db.close();
						}
					}
				);
			}
		});

		return deferred.promise;
	},
	forType: function(type) {
		var deferred = q.defer();

		MongoClient.connect(config.database.connectionString(), function(err, db) {
			if (err) {
				deferred.reject(new Error('Database connection failed'));
				db.close();
			} else {
				db.collection('rolls').aggregate([
						{ $match: { type: type }},
						{ $group: { _id: { used: '$used' }, count: { $sum: 1 }}}
					], function(err, obj) {
						var ret = {
							total: 0,
							used: 0,
							unused: 0
						}

						if (err || !obj) {
							deferred.reject(err);
							db.close();
						} else {
							obj.forEach(function(stat) {
								if (stat._id.used) {
									ret.used = stat.count;
								} else {
									ret.unused = stat.count;
								}

								ret.total = ret.used + ret.unused;
							});

							deferred.resolve(ret);
							db.close();
						}
					}
				);
			}
		});

		return deferred.promise;
	}
}