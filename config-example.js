module.exports = {
	database: {
		protocol: 'mongodb://',
		server: 'mongodb url',
		username: 'mongo username',
		password: 'mongo password',
		connectionString: function() {
			return this.protocol + this.username + ':' + this.password + '@' + this.server;
		}
	}
}