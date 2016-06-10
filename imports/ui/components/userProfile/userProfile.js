import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './userProfile.html';

class UserProfile{
  constructor($scope, $reactive){
    'ngInject';
    $reactive(this).attach($scope);

    this.helpers({
      users() {
          return Meteor.users.find({ '_id': Meteor.userId() });
      }
    });
  }
}

const name = 'userProfile';

export default  angular.module(name, [
    angularMeteor,
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: UserProfile
})
.config(config);

function config($stateProvider) {
'ngInject';
$stateProvider
	.state('userProfile', {
		url: '/userProfile',
		template: '<user-profile></user-profile>'
	});
}
