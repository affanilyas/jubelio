'use strict';

const test = require('tape');
const Hapi = require('hapi');
const plugin = require('./axios');

const server = new Hapi.Server({
	host: 'localhost',
	port: 4000,
});

test('should register hapi-axios', async assert => {
	const options = {
		instances: [
			{
				name: 'typicode',
				axios: {
					baseURL: 'https://jsonplaceholder.typicode.com',
				},
			},
			{
				name: 'metaweather',
				axios: {
					baseURL: 'https://www.metaweather.com/api',
				},
			},
		],
	};
	await server.register({ plugin,	options });
	await server.start();
	const { typicode, metaweather } = server.plugins['hapi-axios'];
	assert.plan(2);
	assert.equal(typicode.defaults.baseURL, options.instances[0].axios.baseURL, 'typicode baseURL must be the same than options');
	assert.equal(metaweather.defaults.baseURL, options.instances[1].axios.baseURL, 'metaweather baseURL must be the same than options');
	assert.end();
});

test('should close server', async assert => {
	await server.stop();
	assert.end();
});
