import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Accounts } from 'meteor/accounts-base';

import template from './register.html';

class Register {
  constructor($scope, $reactive, $state) {
    'ngInject';

    this.$state = $state;

    $reactive(this).attach($scope);
    this.user = {
      eduMail: '',
      normalMail: '',
      passwordretype: ''
    };
    this.credentials = {
      email: '',
      password: '',
      profile: {
        name: '',
        job: 'student'
      }
    };

    this.error = '';
    this.mailError = '';
  }

  //kiểm tra email
  checkEduMail()
  {
    //Kiểm tra mail có hợp lệ hay không
    var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+((\.edu+\.[a-zA-Z]{2,3})|(\.edu))$/;
    if(!re.test(this.user.eduMail)){
      this.mailError = "địa chỉ mail không hợp lệ";
      return false;
    }
    else
      this.mailError = "";

    return true;
  }

  //kiểm tra email thông thường
  checkNormalMail()
  {
    //Kiểm tra mail có hợp lệ hay không
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
    if(!re.test(this.user.normalMail)){
      this.mailError = "địa chỉ mail không hợp lệ";
      return false;
    }
    else
      this.mailError = "";

    return true;
  }

  checkRetype(){
      if(this.user.passwordretype !== this.credentials.password){
        document.getElementById('passError').style.display = 'inline';
        return false;
      }
      else{
        document.getElementById('passError').style.display = 'none';
        return true;
      }
  }

  register() {
    if(this.checkRetype() && (this.checkNormalMail() || this.checkEduMail())){
      //this.credentials.profile.job = this.user.job;
      this.credentials.email = this.user.eduMail + this.user.normalMail;
      Meteor.call('sendEmail', this.credentials.email);
      Accounts.createUser(this.credentials,
        this.$bindToContext((err) => {
          if (err) {
            this.error = err;
          } else {
            this.$state.go('home');
          }
        })
      );
    }
  }

  showEduMail(){
    document.getElementById('eduMail').style.display = 'inline';
    document.getElementById('normalMail').style.display = 'none';
  }

  showNormalMail(){
    document.getElementById('eduMail').style.display = 'none';
    document.getElementById('normalMail').style.display = 'inline';
  }
}

const name = 'register';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Register
  })
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider.state('register', {
    url: '/register',
    template: '<register></register'
  });
}
