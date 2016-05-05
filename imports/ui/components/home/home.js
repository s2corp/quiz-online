import angular from 'angular';
import angularMeteor from 'angular-meteor';

import {name as Login} from '../login/login';
import './home.html';

class Home{}

const name = 'home';

export default  angular.module(name, [
    angularMeteor,
    Login,
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Home
})
.config(config);

function config($stateProvider) {
'ngInject';
$stateProvider
	.state('home', {
		url: '/home',
		template: '<home></home>'
	});
}
