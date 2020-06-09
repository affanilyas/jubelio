# hapi-axios

> a fun and lightweight integration between hapi and axios

### Dependencies

Hapi >= 17.5.3
Axios >= 0.18.0

### Usage

1. Installation

```bash
npm i hapi-axios
```

2. Register

```js
const Hapi = require('hapi');
const HapiAxios = require('hapi-axios');

const server = new Hapi.Server({
  host: 'localhost',
  port: 4000,
});

await server.register({
  plugin: HapiAxios,
  options: {
    instances: [
      {
        name: 'typicode',
        axios: {
          baseURL: 'https://jsonplaceholder.typicode.com',
          // you can use any axios config here. https://github.com/axios/axios#creating-an-instance
        },
      },
    ],
  },
});

await server.start();
```

3. Usage

```js
server.route({
  handler: async (request, h) => {
    const { typicode }  = request.server.plugins['hapi-axios'];
    const { data } = await typicode.get('users');
    // GET https://jsonplaceholder.typicode.com/users
    return h.response(data);
  },
  method: 'GET',
  path: '/users',
});
```


