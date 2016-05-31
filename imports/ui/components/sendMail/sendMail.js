import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './sendMail.html';
import { Responsive } from '../../../api/responsive';
//import { Users } from '../../../api/lists/user.js';
Meteor.subscribe('responsive')

class SendMail{

  constructor(){
    this.mail = {
      userId: '',
      mailAddress: '',
      title: '',
      content: ''
    };

    if(Meteor.userId())
      this.mail.userId = Meteor.userId();
  }

  sendMail(){
    Responsive.insert(this.mail);
  }
}


const name = 'sendMail';

export default  angular.module(name, [
    angularMeteor
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: SendMail
})
