var rollRepositoryPrototype = require('../models/roll-repository'),
	rollPrototype = require('../models/roll'),
	config = require('../config-test'),
	assert = require('assert'),
	MongoClient = require('mongodb').MongoClient;

describe('RollRepository', function() {
	var repo,
		rollID;

	before(function(done) {
		var newRoll = Object.create(rollPrototype);
		newRoll.init({
			type: 2,
			value: 1,
			certified: true,
			dateAdded: Date.now(),
			used: false
		});

		MongoClient.connect(config.database.connectionString(), function(err, db) {
			if (err)
			{
				throw('Database connection failed');
			}

			var rolls = db.collection('rolls');

			rolls.remove(function() {
				db.collection('rolls').insert(newRoll, function(err, objects) {
					if (err)
					{
						throw('Insert failed');
					}

					rollID = objects[0]._id;
					done();
				});
			});
		});

		repo = Object.create(rollRepositoryPrototype);
		done();
	});

	describe('#validate', function() {
		var validRoll,
			invalidRoll;

		before(function(done) {
			validRoll = Object.create(rollPrototype);
			validRoll.init({
				type: 2,
				value: 1,
				certified: true,
				used: false
			});
			done();
		});

		beforeEach(function(done) {
			invalidRoll = Object.create(rollPrototype);
			invalidRoll.init({
				type: 2,
				value: 1,
				certified: true,
				used: false
			});
			done();
		});

		it('should return true if all required properties exist and have correct values', function() {
			assert(repo.validate(validRoll));
		});

		it('should return false if the "value" property is less than 1', function() {
			invalidRoll.value = 0;
			assert(repo.validate(invalidRoll), false);
		});

		it('should return false if the "value" property is greater than the "type" property', function() {
			invalidRoll.value = 23;
			invalidRoll.type = 6;
			assert(repo.validate(invalidRoll), false);
		});

		it('should return false if the "type" property is missing', function() {
			delete invalidRoll.type;
			assert(repo.validate(invalidRoll), false);
		});

		it('should return false if the "value" property is missing', function() {
			delete invalidRoll.value;
			assert(repo.validate(invalidRoll), false);
		});

		it('should return false if the "certified" property is missing', function() {
			delete invalidRoll.certified;
			assert(repo.validate(invalidRoll), false);
		});

		it('should return false if the "used" property is missing', function() {
			delete invalidRoll.used;
			assert(repo.validate(invalidRoll), false);
		});

		it('should return false if the "id" property is present and the "dateAdded" property is missing', function() {
			delete invalidRoll.dateAdded;
			invalidRoll.id = 1234;

			assert(repo.validate(invalidRoll), false);
		});

		it('should return false if the "used" property is true and the "dateUsed" property is missing', function() {
			invalidRoll.used = true;
			delete invalidRoll.dateUsed;

			assert(repo.validate(invalidRoll), false);
		});
	});

	describe('#get', function() {
		it('should get a valid roll without error', function(done) {
			assert.doesNotThrow(function() {
				repo.get(1234).then(function(roll) {
					assert(repo.validate(roll));
					done();
				});
			});
		});
	});

	describe('#create', function() {
		it('should create a valid roll in the database', function(done) {
			var newRoll = Object.create(rollPrototype);
			newRoll.init({
				type: 2,
				value: 1,
				certified: true
			});

			repo.create(newRoll).then(function(roll) {
				assert.doesNotThrow(function() {
					assert(repo.validate(roll));
					assert('id' in roll);
				})
			});
		});
	});

	describe('#update', function() {
		it('should update a roll with an id', function(done) {
			var oldRoll = repo.get(1234);
		})
	});

	describe('#find', function() {
		var rolls;

		before(function(done) {
			var promise = repo.find({
				type: [2, 4, 6]
			});

			promise.then(function(foundRolls) {
				rolls = foundRolls;
				done();
			}, function() {
				throw('Find failed');
			});
		});

		it('should return an array with 0 or more roll objects', function() {
			assert('length' in rolls && typeof rolls.length === 'number');
		});
	});

	describe('#remove', function() {
		var rollID = 1234,
			success;

		before(function(done) {
			var promise = repo.remove(rollID);

			promise.then(function(s) {
				success = s;
				done();
			}, function() {
				throw('Delete failed');
			});
		});

		it('should return true', function() {
			assert(success);
		});
	});
})