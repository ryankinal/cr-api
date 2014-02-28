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

			invalidRoll = Object.create(rollPrototype);
			invalidRoll.init();
		});

		it('should return true if all required properties exist and have correct values', function() {

		});

		it('should return false if the "value" property is less than 1', function() {

		});

		it('should return false if the "value" property is greater than the "type" property', function() {

		});

		it('should return false if the "type" property is missing', function() {

		});

		it('should return false if the "value" property is missing', function() {

		});

		it('should return false if the "certified" property is missing', function() {

		});

		it('should return false if the "used" property is missing', function() {

		});

		it('should return false if the "id" property is present and the "dateAdded" property is missing', function() {

		});

		it('should return false if the "used" property is true and the "dateUsed" property is missing', function() {

		});
	});

	describe('#get', function() {
		var roll;

		it('should return an object', function() {

		});

		it('should return a valid roll object', function() {

		});
	});

	describe('#create', function() {
		var roll

		it('should insert a new roll without error', function() {
			
		});

		it('should set an id on the new roll', function() {

		});

		it('should return a valid roll object', function() {

		});

		it('should put the new roll in the database', function() {

		});
	});

	describe('#update', function() {
		it('should update an already-existent roll by whole object without error', function() {

		});

		it('should not update a roll if it does not have an id', function() {

		});

		it('should return a roll with all necessary properties', function() {

		});

		it('should not change the id of the roll', function() {

		});
	});

	describe('#find', function() {
		it('should query the data store without error', function() {

		});

		it('should return an array with 0 or more roll objects', function() {

		});
	});

	describe('#delete', function() {
		it('should delete an already-existent roll by id without error and return true', function() {

		});

		it('should delete an already-existent roll by whole object without error and return true', function() {

		})

		it('should return false if the roll does not exist', function() {

		});

		it('should remove the specified roll from the database', function() {

		});
	});
})