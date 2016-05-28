import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from "angular-ui-router";
import './pageNotFound.html';

class PageNotFound{}

const name = 'pageNotFound';

export default  angular.module(name, [
    angularMeteor,
    uiRouter,
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PageNotFound
})
.config(config);

function config($stateProvider) {
'ngInject';
$stateProvider
	.state('pageNotFound', {
		url: '/pageNotFound',
		template: '<page-not-found></page-not-found>'
	});
}
