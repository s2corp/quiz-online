import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
//import { Users } from '../../../api/lists/user.js';

import './registerTeacher.html';
import '../template/vertificateMail.html';

class RegisterTeacher{

  constructor(){
    this.user = {};
    this.user.gender = "Nam";
    this.errorMail = "";
    this.errorLastName = "";
    this.errorFirstName = "";
    this.errorDate = "";
    this.errorSchool = "";
    this.errorAddress = "";
    this.errorPhone = "";
    this.errorRetype = "";
    this.errorPassword = "";
  }

  //đăng ký user mới
  register()
  {
    this.user.job = "teacher";
    if(this.checkMail() && this.checkRetypePassword() && this.checkPassword() && this.checkRequired()){
      this.sendMail();
      this.reset();
    }
  }

  //làm mới các input
  reset()
  {
    this.user = {};
    this.user.gender = "Nam";
    this.errorMail = "";
    this.errorLastName = "";
    this.errorFirstName = "";
    this.errorDate = "";
    this.errorSchool = "";
    this.errorAddress = "";
    this.errorPhone = "";
    this.errorRetype = "";
    this.errorPassword = "";
  }

  //gửi mail
  sendMail()
  {
    var Cryptr = require('cryptr'),
    cryptr = new Cryptr('ntuquiz123');
    this.user.password = cryptr.encrypt(this.user.password);
    var content = '{"mail":'+ '"' + this.user.mail + '"';
        content = content + ',"lastname":' + '"' + this.user.lastName + '"';
        content = content + ',"firstname":' + '"' + this.user.firstName + '"';
        content = content + ',"gender":' + '"' + this.user.gender + '"';
        content = content + ',"date":' + '"' + this.user.date + '"';
        content = content + ',"school":' + '"' + this.user.school + '"';
        content = content + ',"address":' + '"' + this.user.address + '"';
        content = content + ',"phone":' + '"' + this.user.phone + '"';
        content = content + ',"password":' + '"' + this.user.password + '"' + '}';

    var encryptedString = cryptr.encrypt(content);

    Meteor.call('sendEmail', this.user.mail, encryptedString);
  }

  //kiểm tra email
  checkMail()
  {

    //Kiểm tra mail có tồn tại hay không
    if(!Meteor.call('findUser', this.user.mail)){
       this.errorMail = "mail đã được đăng ký, quên mật khẩu?";
       return false;
    }
    else
       this.errorMail = "";

    //Kiểm tra mail có hợp lệ hay không
    var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+((\.edu+\.[a-zA-Z]{2,3})|(\.edu))$/;
    if(!re.test(this.user.mail)){
      this.errorMail = "địa chỉ mail không hợp lệ";
    }
    else
      this.errorMail = "";

    return true;
  }

  //kiểm tra định dạng mật khẩu
  checkPassword(){

    //kiểm tra bắt buộc
    // if(this.user.password == null){
    //   this.errorPassword = "*";
    //   return false;
    // }
    // else
    //   this.errorPassword = "";

    var pString = this.user.password;
    if(pString != null && (pString.match(/[a-z]/gi) == null || pString.match(/[0-9]/g) == null || pString.length < 8)){
      this.errorPassword = "mật khẩu tối thiểu 8 kí tự, bao gồm chữ và số";
      return false;
    }
    else
      this.errorPassword = "";
    return true;
  }

  //kiểm tra mật khẩu nhập lại
  checkRetypePassword()
  {
    //kiểm tra bắt buộc
    // if(this.user.retype == null){
    //   this.errorRetype = "*";
    //   return false;
    // }
    // else
    //   this.errorRetype = "";

    //kiểm tra trùng lặp password
    if(this.user.retype != null && this.user.password != this.user.retype){
      this.errorRetype = "mật khẩu nhập lại không chính xác";
      return false;
    }
    else
      this.errorRetype = "";
    return true;
  }

  //kiểm tra bắt buộc
  checkRequired(){

    if(this.user.mail == null){
      this.errorMail = "trường này là bắt buộc";
      return false;
    }

    if(this.user.lastName == null){
      this.errorLastName = "trường này là bắt buộc";
      return false;
    }

    if(this.user.firstName == null){
      this.errorFirstName = "trường này là bắt buộc";
      return false;
    }

    if(this.user.firstName == null){
      this.errorFirstName = "trường này là bắt buộc";
      return false;
    }

    if(this.user.school == null){
      this.errorSchool = "trường này là bắt buộc";
      return false;
    }

    if(this.user.address == null){
      this.errorAddress = "trường này là bắt buộc";
      return false;
    }

    if(this.user.phone == null){
      this.errorPhone = "trường này là bắt buộc";
      return false;
    }

    if(this.user.password == null){
      this.errorPassword = "trường này là bắt buộc";
      return false;
    }

    if(this.user.retype == null){
      this.errorRetype = "trường này là bắt buộc";
      return false;
    }

    return true;
  }
}

const name = 'registerTeacher';

export default  angular.module(name, [
    angularMeteor,
    uiRouter,
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/register_teacher/${name}.html`,
  controllerAs: name,
  controller: RegisterTeacher
})
.config(config);

function config($stateProvider) {
'ngInject';
$stateProvider
	.state('teacher', {
		url: '/register/teacher',
		template: '<register_teacher></register_teacher>'
	});
}
