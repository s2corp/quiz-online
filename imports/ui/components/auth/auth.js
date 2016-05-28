import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import template from './auth.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
import { name as Login } from '../login/login';
import { name as Register } from '../register/register';
import { name as Password } from '../password/password';
Meteor.subscribe('userStatus');

const name = 'auth';

class Auth {
  constructor($scope, $reactive, $state) {
    'ngInject';

    $reactive(this).attach($scope);

    this.state = $state;
    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUser() {
        if (Meteor.user())
          return Meteor.user();
      },
      userImage(){
        if (Meteor.user()){
          return Meteor.user().profile.picture;
        }
        //return (Meteor.user().profile.picture);
      }
    });
  }

  logout() {
    Accounts.logout();
    this.state.go('home');
    delete Session.keys['questionId'];
    delete Session.keys['questionCount'];
    delete Session.keys['selectedTab'];
  }
}

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter,
  Login,
  Register,
  Password
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Auth
});
