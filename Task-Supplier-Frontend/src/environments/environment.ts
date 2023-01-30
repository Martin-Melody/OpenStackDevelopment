// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUri: 'http://localhost:3000',
  auth0: {
    domain: 'dev-h44j37rzds88jnjr.eu.auth0.com',
    clientId: 'JRS94CSwkjLts8TynTPDCtUMqQQuyX43',
    callback_URL: 'localhost:4200/callback',
    audience:'suppliers'
  },
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
