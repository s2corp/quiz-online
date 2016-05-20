import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './login.html';
//import { Users } from '../../../api/lists/user.js';

class Login{

  constructor(){
    this.user = {};
  }

  login(){
    var Cryptr = require('cryptr'),
    cryptr = new Cryptr('ntuquiz123');
    this.user.password = cryptr.encrypt(this.user.password);
    if(Meteor.users.find( { mail: this.user.mail, password: this.user.password} ).count() > 0){
      alert("đăng nhập thành công");
    }
    else
      alert("đăng nhập thất bại");
    this.reset();
  }

  reset(){
    this.user = {};
  }
}

const name = 'login';

export default  angular.module(name, [
    angularMeteor,
    uiRouter,
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Login
})
// .config(config);
//
// function config($stateProvider) {
// 'ngInject';
// $stateProvider
// 	.state('login', {
// 		url: '/login',
// 		template: '<login></login>'
// 	});
// }
