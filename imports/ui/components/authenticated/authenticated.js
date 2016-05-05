import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './authenticated.html';
//import { Users } from '../../../api/lists/user.js';

class Authenticated{
  constructor($stateParams) {
    'ngInject';

    var Cryptr = require('cryptr'),
    cryptr = new Cryptr('ntuquiz123');

    var decryptedString = cryptr.decrypt($stateParams.info);
    var user = JSON.parse(decryptedString);
    Meteor.call('insertUser', user);
  }
}

const name = 'authenticated';

export default  angular.module(name, [
    angularMeteor,
    uiRouter
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Authenticated
})
.config(config);

function config($stateProvider) {
'ngInject';
$stateProvider
	.state('registerUser', {
		url: '/signup/:info',
		template: '<authenticated></authenticated>'
	});
}
