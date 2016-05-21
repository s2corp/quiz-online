import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from "angular-ui-router";
import { name as Notification } from '../notification/notification';
import './home.html';

class Home{}

const name = 'home';

export default  angular.module(name, [
    angularMeteor,
    uiRouter,
    'accounts.ui',
    Notification
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
