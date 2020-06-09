const Hapi = require('hapi');
const HapiAxios = require('hapi-axios');
 
const server = new Hapi.Server({
  host: 'localhost',
  port: 4000,
});
 
const bootUpServer = async () => {
    await server.register({
        plugin: HapiAxios,
        options: {
          instances: [
            {
              name: 'typicode',
              axios: {
                baseURL: 'https://jsonplaceholder.typicode.com/users',
                // you can use any axios config here. https://github.com/axios/axios#creating-an-instance
              },
            },
          ],
        },
      });
       
      await server.start();
}

bootUpServer();