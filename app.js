var express = require('express'),
	q = require('q'),
	repo = require('./models/roll-repository'),
	stats = require('./models/stats-repository'),
	config = require('./config'),
	app = express();

app.configure(function() {
	app.use(express.json());
	app.use(express.urlencoded());
});

app.post('/roll', function(req, res) {
	repo.create(req.body).then(function(roll) {
		res.jsonp({
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
		res.jsonp({
			meta: {
				success: false
			},
			error: err.message
		})
	});
});

app.get('/roll', function(req, res) {
	if (req.query.type) {
		repo.getRandom(parseInt(req.query.type, 10)).then(function(roll) {
			if (roll) {
				res.jsonp({
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
				res.jsonp({
					meta: {
						success: false
					},
					error: 'No rolls of type ' + req.query.type + ' found'
				});
			}
		}, function(err) {
			res.statusCode = 404;
			res.jsonp({
				meta: {
					success: false
				},
				error: 'No rolls of type ' + req.query.type + ' found'
			});
		});
	} else {
		res.statusCode = 400;
		res.jsonp({
			meta: {
				success: false
			},
			error: 'A roll type (die type) must be provided in the query string'
		})
	}
});

app.get('/roll/:id', function(req, res) {
	repo.get(req.params.id).then(function(roll) {
		res.jsonp({
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
		res.jsonp({
			meta: {
				success: false
			},
			error: 'Roll ID ' + req.params.id + ' not found'
		});
	});
});

app.get('/rolls', function(req, res) {
	if (req.query.ids) {
		var ids = req.query.ids.split(',');
		repo.getMany(ids).then(function(rolls) {
			res.jsonp({
				meta: {
					success: true
				},
				rolls: rolls
			});
		});
	} else {
		res.statusCode = 400;
		res.jsonp({
			meta: {
				success: false
			},
			error: '/rolls requires the ids parameter in the query string'
		});
	}
});

app.get('/proxy.html', function(req, res) {
	res.type('text/html');
	res.sendfile('proxy.html');
});

app.get('/xdomain.min.js', function(req, res) {
	res.type('text/javascript');
	res.sendfile('vendor/xdomain/dist/0.6/xdomain.min.js');
});

app.get('/stats', function(req, res) {
	q.spread([stats.total(), stats.groupByType()], function(total, byType) {
		byType.all = total

		res.jsonp({
			meta: {
				success: true
			},
			links: {
				self: '/stats'
			},
			stats: byType
		});
	}, function(err) {
		res.jsonp({
			meta: {
				success: false
			},
			error: err
		});
	})
});

app.get('/stats/:type', function(req, res) {
	stats.forType(parseInt(req.params.type)).then(function(stats) {
		res.jsonp({
			meta: {
				success: true
			},
			links: {
				self: '/stats/' + req.params.type
			},
			stats: stats
		});
	}, function(err) {
		res.jsonp({
			meta: {
				success: false
			},
			error: err
		});
	});
});

app.listen(process.env.PORT || 4444);