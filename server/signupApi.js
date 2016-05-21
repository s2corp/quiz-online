// import { Users } from '../imports/api/lists/user.js';
//
// var Api = new Restivus({
//     useDefaultAuth: true,
//     prettyJson: true
//   });
//
//   var Cryptr = require('cryptr'),
//       cryptr = new Cryptr('ntuquiz123');
//
// Api.addRoute('signup/:info', {authRequired: false}, {
//     get: function () {
//       var decryptedString = cryptr.decrypt(this.urlParams.info);
//       var user = JSON.parse(decryptedString);
//
//       Users.insert(user);
//       return {
//         statusCode: 200,
//         messages: decryptedString
//       };
//     }
//   });
