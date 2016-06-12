import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './login.html';
import './loginModal.html'

const name = 'login';
class Login {
  constructor($scope, $reactive, $state, $mdDialog, $mdMedia) {
    'ngInject';

    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia
    $reactive(this).attach($scope);

    this.credentials = {
      email: '',
      password: ''
    };

    this.error = '';
  }

  // Đăng nhập bằng facebook
  loginFB()
  {
    Meteor.loginWithFacebook({
      requestPermissions: ['user_friends', 'public_profile', 'email']
    }, (err) => {
        if (err) {
          // handle error
      } else {
        this.$state.go('home');
        this.showVertificateForm();
      }
    })
  }

  //chọn đối tượng nghiên cứu và chứng thực user
  showVertificateForm() {
    console.log(Meteor.user());
    if(Meteor.user())
      if(Meteor.user().profile.job === ''){
        this.$mdDialog.show({
          controller($mdDialog) {
            'ngInject';
            this.close = () => {
              $mdDialog.hide();
            },

            this.showVertificate = () => {
              document.getElementById('vertificate').style.visibility = 'visible';
            },

            this.hideVertificate = () => {
              document.getElementById('vertificate').style.visibility = 'hidden';
            },

            this.checkMail = () => {

            //Kiểm tra mail có hợp lệ hay không
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
              //var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+((\.edu+\.[a-zA-Z]{2,3})|(\.edu))$/;
              if(!re.test(this.user.mail)){
                this.errorMail = "địa chỉ mail không hợp lệ";
                return false;
              }
              else
                this.errorMail = "";

                return true;
              },

              this.vertificate = () => {
                if(this.myForm.$valid){
                  if(this.user.code === 'teacher')
                  if(this.checkMail())
                  {
                  //gửi mail bằng methods phía server
                    Meteor.call('sendEmail', this.user.mail);
                    this.close();
                  }
                  if(this.user.code === 'student')
                  {
                    Meteor.call('updateUser', this.user)
                    this.close();
                  }
                }
              }
            },
            controllerAs: 'loginModal',
            templateUrl: `imports/ui/components/${name}/loginModal.html`,
            targetEvent: event,
            parent: angular.element(document.body),
            //clickOutsideToClose: true,
            fullscreen: this.$mdMedia('lg')
          });
        }
  }

  loginGG(){
    Meteor.loginWithGoogle({
      requestPermissions: ['email']
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
