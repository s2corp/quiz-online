import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './register.html';

class Register{}

const name = 'register';

export default  angular.module(name, [
    angularMeteor,
    uiRouter
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Register
})
.config(config);

function config($stateProvider) {
'ngInject';
$stateProvider
	.state('register', {
		url: '/register',
		template: '<register></register>'
	});
}
