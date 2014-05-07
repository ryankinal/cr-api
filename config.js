module.exports = {
	database: {
		protocol: 'mongodb://',
		server: process.env.MLURL,
		username: process.env.MLUSER,
		password: process.env.MLPASS,
		connectionString: function() {
			return this.protocol + this.username + ':' + this.password + '@' + this.server;
		}
	},
	validTypes: [2, 4, 6, 8, 10, 12, 20, 30, 100]
}