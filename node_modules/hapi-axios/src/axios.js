'use strict';

const debug = require('debug')('hapi-axios');
const axios = require('axios');

function register(server, options) {
	options.instances.forEach(httpOptions => {
		const instance = axios.create(httpOptions.axios);
		debug('Creating axios instance %o', httpOptions.axios);
		server.expose(httpOptions.name, instance);
		debug(`Axios instance exposed in server.plugins['hapi-axios']['${httpOptions.name}']`);
	});
}

const plugin = {
	name: 'hapi-axios',
	register,
	version: '1.0.0',
};

module.exports = plugin;
