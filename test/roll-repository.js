var rollRepositoryPrototype = require('../models/roll-repository'),
	rollPrototype = require('../models/roll'),
	assert = require('assert');

describe('RollRepository', function() {
	var repo;

	before(function(done) {
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
			assert(!repo.validate(invalidRoll));
		});

		it('should return false if the "value" property is greater than the "type" property', function() {
			invalidRoll.value = 23;
			invalidRoll.type = 6;
			assert(!repo.validate(invalidRoll));
		});

		it('should return false if the "type" property is missing', function() {
			delete invalidRoll.type;
			assert(!repo.validate(invalidRoll));
		});

		it('should return false if the "value" property is missing', function() {
			delete invalidRoll.value;
			assert(!repo.validate(invalidRoll));
		});

		it('should return false if the "certified" property is missing', function() {
			delete invalidRoll.certified;
			assert(!repo.validate(invalidRoll));
		});

		it('should return false if the "used" property is missing', function() {
			delete invalidRoll.used;
			assert(!repo.validate(invalidRoll));
		});

		it('should return false if the "id" property is present and the "dateAdded" property is missing', function() {
			delete invalidRoll.dateAdded;
			invalidRoll.id = 1234;

			assert(!repo.validate(invalidRoll));
		});

		it('should return false if the "used" property is true and the "dateUsed" property is missing', function() {
			invalidRoll.used = true;
			delete invalidRoll.dateUsed;

			assert(!repo.validate(invalidRoll));
		});
	});

	describe('#get', function() {
		var roll;

		before(function(done) {
			roll = repo.get(12345);
		});

		it('should return a valid roll object', function() {
			assert(roll && repo.validate(roll));
		});
	});

	describe('#create', function() {
		var roll,
			returned;

		before(function(done) {
			var promise;

			roll = Object.create(rollPrototype);
			roll.init({
				type: 2,
				value: 1,
				certified: true,
			});

			promise = repo.insert(roll);

			promise.then(function(newRoll) {
				returned = newRoll;
				done();
			}, function() {
				throw('Insert failed');
			});
		});

		it('should set an id on the new roll', function() {
			assert('id' in returned && typeof returned.id === 'string');
		});

		it('should return a valid roll object', function() {
			assert(repo.validate(returned));
		});
	});

	describe('#update', function() {
		var noID,
			roll,
			returned;

		before(function(done) {
			var promise = repo.get(1324);

			noID = Object.create(rollPrototype);
			noID.init({
				type: 2,
				value: 1,
				certified: true
			});

			promise.then(function(newRoll) {
				var p2;

				roll = newRoll;
				roll.used = true;
				roll.dateUsed = Date.now();

				p2 = repo.update(roll);
				p2.then(function(updatedRoll) {
					returned = updatedRoll;
					done();
				}, function() {
					throw('Update failed');
				})
			}, function() {
				throw('Get failed');
			});
		});

		it('should not update a roll if it does not have an id', function() {
			assert.throws(function() {
				repo.update(noID);
			});
		});

		it('should return a valid roll object', function() {
			assert(repo.validate(returned));
		});

		it('should not change the id of the roll', function() {
			assert(roll.id === returned.id);
		});
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