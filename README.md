# TODOs

- setup and test sass imports
- setup and test image imports
- server side rendering ? (relay ?)
- config npm module (+ exposable serialized config)
- ✅setup and test eslint with babel


# Develop and leverage hot reloading, lint, build and run
- develop: `npm run dev`
- lint: `npm run lint`
- build: `npm run build`
- run production build: `npm start`


# Configuration
To run our application on different environments, we are using the [`config` npm module](https://www.npmjs.com/package/config). This module two key features:

1. configuration files for different environments
1. the possibility to overwrite parts of our configuration by using **environment variables** that will be *injected* through our `Dockerfile`


## Configuration files

**IMPORTANT**: Configuration files are being loaded in the following order

1. Default configuration `default.js`
1. Environment specific configuration based on value of `NODE_ENV` (`development.js`, `production.js`)
1. Local configuration `local.js`, which can be used to quickly overwrite settings without having to touch environment configuration files
1. Values that are being set through real **environment variables**. A file named `custom-environment-variables.js` must therefore exist, whose keys and key structure are the same as in every other configuration file. The values however reflect the name of the corresponding environmen variable as found in our `Dockerfile` (e.g. `APP_DATABASE_URL=http://qs.app.com:27017`)
for further information regarding environment variables, see https://github.com/lorenwest/node-config/wiki/Environment-Variables#custom-environment-variables


## Configuration Usage
Only `development` or `production` are permitted values for `NODE_ENV`. If nothing is specified, `development` has to be assumed!  

This is due to the fact that many libraries nowadays use `NODE_ENV === 'production'` to compile specific code that does not contain additional checks, hints or operations that would otherwise slow down a version used in production.

Therefore, all *dynamic* configuration, especially URLs, must be set via environment variables that we can define in our `Dockerfile`.

This also makes it a lot easier to alter the behavior of our applications on the fly (e.g. enable / disable a login or activate enhanced supportive tools) by simply changing the related values inside the `Dockerfile` and restarting the servers.


### *Private* server configuration


### *Public* client configuration


# Build process
No final decision yet if we will also built the server with webpack (or babel only, which would mean one dep less)

- webpack for client AND server
- webpack for client, babel for server
    ==> `babel src/server --out-dir build/server`  
    ==> `node_modules/babel-cli/bin/babel.js src/server --out-dir build/server`
