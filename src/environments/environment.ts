// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  accessTokenMapbox: 'pk.eyJ1IjoiY2hpdHRyYW5nIiwiYSI6ImNqa25wdTFkdDI0M2czcXAwZXMwd3BtcGMifQ.N16-ZHDLbfuI4M2gkqoZoQ', //'pk.eyJ1IjoiY2hpdHRyYW5nIiwiYSI6ImNqanA3dHA5NTd3MjEzcGxmdDV0Njc4NXQifQ.NapWZkvR3_lYOqXQkZg99A',//'pk.eyJ1Ijoid3lra3NzIiwiYSI6ImNqMjR6aTdmdzAwNHMzMnBvbjBucjlqNm8ifQ.6GjGpofWBVaIuSnhdXQb5w',
  directionsURL : 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/',
  apiurl:'/api',   //''https://ru5aqr8de8.execute-api.ap-southeast-2.amazonaws.com/Stage'',
  apiauthkey:'12345678901234567890',
  errorMessage404:"tracking for this job has expired",
  errorMessage410:"tracking for this job has expired",
  errorInvalidKey:"Invalid Job",
  serverError:'tracking paused – service outage'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
