var express = require('express'),
	repo = require('./models/roll-repository'),
	config = require('./config'),
	app = express();

app.configure(function() {
	app.use(express.json());
	app.use(express.urlencoded());
});

app.post('/roll', function(req, res) {
	repo.create(req.body).then(function(roll) {
		res.json({
			meta: {
				success: true
			},
			links: {
				self: '/roll/' + roll.id
			},
			roll: roll
		});
	}, function(err) {
		res.statusCode = 400;
		res.json({
			meta: {
				success: false
			},
			error: err
		})
	});
});

app.get('/roll', function(req, res) {
	if (req.query.type) {
		repo.getRandom(parseInt(req.query.type, 10)).then(function(roll) {
			if (roll) {
				res.json({
					meta: {
						success: true
					},
					links: {
						self: '/roll/' + roll.id,
						another: '/roll?type=' + roll.type
					},
					roll: roll
				});
			} else {
				res.statusCode = 404;
				res.json({
					meta: {
						success: false
					},
					error: 'No rolls of type ' + req.query.type + ' found'
				});
			}
		}, function(err) {
			res.statusCode = 404;
			res.json({
				meta: {
					success: false
				},
				error: 'No rolls of type ' + req.query.type + ' found'
			});
		});
	} else {
		res.statusCode = 400;
		res.json({
			meta: {
				success: false
			},
			error: 'A roll type (die type) must be provided in the query string'
		})
	}
});

app.get('/roll/:id', function(req, res) {
	repo.get(req.params.id).then(function(roll) {
		res.json({
			meta: {
				success: true
			},
			links: {
				self: '/roll/' + roll.id
			},
			roll: roll
		})
	}, function() {
		res.statusCode = 404;
		res.json({
			meta: {
				success: false
			},
			error: 'Roll ID ' + req.params.id + ' not found'
		});
	});
});

app.listen(process.env.PORT || 4444);