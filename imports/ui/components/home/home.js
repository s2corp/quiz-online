import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from "angular-ui-router";

import { name as Notification } from '../notification/notification';

import { Responsive } from '../../../api/responsive';

import './home.html';

Meteor.subscribe('user')

class Home {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.helpers({
      responsiver() {


        var respondList = [];

        var responsives = Responsive.find({}, {limit: 4}).fetch();
        for(i = 0; i < responsives.length; i ++){

          var responser = {
            userMail: responsives[i].mailAddress,
            userProfile: Meteor.users.findOne( { _id: responsives[i].userId } ),
            title: responsives[i].title,
            content: responsives[i].content
          }

          respondList.push(responser);
        }

        return respondList;
      }
    })
  }
}

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
