var q = require('q'),
	config = require('../config-test'),
	MongoClient = require('mongodb').MongoClient;

module.exports = {
	validate: function() {
	},
	get: function() {
		var deferred = q.defer();
		return deferred.promise;
	},
	find: function() {
		var deferred = q.defer();
		return deferred.promise;
	},
	create: function() {
		var deferred = q.defer();
		return deferred.promise;
	},
	update: function() {
		var deferred = q.defer();
		return deferred.promise;
	},
	remove: function() {
		var deferred = q.defer();
		return deferred.promise;
	}
};