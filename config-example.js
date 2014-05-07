module.exports = {
	database: {
		protocol: 'mongodb://',
		server: 'mongodb url',
		username: 'mongo username',
		password: 'mongo password',
		connectionString: function() {
			return this.protocol + this.username + ':' + this.password + '@' + this.server;
		}
	},
	validTypes: [2, 4, 6, 8, 10, 12, 20, 30, 100]
}