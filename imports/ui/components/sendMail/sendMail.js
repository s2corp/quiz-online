import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './sendMail.html';
//import { NotificationData } from '../../../api/notificationdata';
//import { Users } from '../../../api/lists/user.js';

class SendMail{

  constructor(){
    this.mail = {};
  }

  sendMail(){
    Meteor.call('userSendMail', this.mail)
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
