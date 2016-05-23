import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './login.html';

class Login {
  constructor($scope, $reactive, $state) {
    'ngInject';

    this.$state = $state;

    $reactive(this).attach($scope);

    this.credentials = {
      email: '',
      password: ''
    };

    this.error = '';
  }

  loginFB()
  {
    Meteor.loginWithFacebook({
      requestPermissions: ['user_friends', 'public_profile', 'email']
    }, (err) => {
        if (err) {
          // handle error
      } else {
        this.$state.go('home');
      }
    })
  }

  loginGG(){
    Meteor.loginWithGoogle({
      requestPermissions: ['user_friends', 'public_profile', 'email']
    }, (err) => {
        if (err) {
          // handle error
      } else {
        this.$state.go('home');
      }
    })
  }

  login() {
    Meteor.loginWithPassword(this.credentials.email, this.credentials.password,
      this.$bindToContext((err) => {
        if (err) {
          this.error = err;
        } else {
          this.$state.go('parties');
        }
      })
    );
  }
}

const name = 'login';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Login
  })
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    template: '<login></login>'
  });
}
