var controller = require('../controllers/roll-controller'),
	repository = require('../models/roll-repository'),
	rollPrototype = require('../models/roll'),
	assert = require('assert'),
	newRollFunction = function(type) {
		return function() {
			var roll;

			before(function(done) {
				roll = Object.create(rollPrototype);
				done();
			});

			it('should initialize without error', function() {
				assert.doesNotThrow(function() {
					roll.init(2, Math.floor(Math.random() * type) + 1, true);
				});
			});

			it('should have a "type" property of ' + type, function() {
				assert(roll.type === type);
			});

			it('should have a "value" property between 1 and ' + type, function() {
				assert(roll.value >= 1 && roll.value <= type);
			});

			it('should have a "used" property of false', function() {
				assert.equal(roll.used, false);
			});

			it('should have a "certified" property of true', function() {
				assert.equal(roll.certified, true);
			});

			it('should have a "dateAdded" property that is a valid unix timestamp', function() {
				assert('number', typeof roll.dateAdded);

				assert.doesNotThrow(function() {
					var d = new Date(roll.dateAdded);
				});
			});

			it('should not have a "dateUsed" property', function() {
				assert(!('dateUsed' in roll));
			});
		}
	};

describe('A new d2 roll', newRollFunction(2));
describe('A new d4 roll', newRollFunction(4));
describe('A new d6 roll', newRollFunction(6));
describe('A new d8 roll', newRollFunction(8));
describe('A new d10 roll', newRollFunction(10));
describe('A new d12 roll', newRollFunction(12));
describe('A new d20 roll', newRollFunction(20));
describe('A new d30 roll', newRollFunction(30));
describe('A new d100 roll', newRollFunction(100));

describe('A new and invalid d51 roll', function() {
	var roll;

	before(function(done) {
		roll = Object.create(rollPrototype);
		done();
	});

	it('should error out when initializing', function() {
		assert.throws(function() {
			roll.init(2, Math.floor(Math.random() * 51) + 1, true);
		});
	});
});