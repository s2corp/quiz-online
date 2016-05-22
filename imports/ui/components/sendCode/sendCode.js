import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './sendCode.html';
import { NotificationData } from '../../../api/notificationdata';
//import { Users } from '../../../api/lists/user.js';

class SendCode{

  constructor($scope, $reactive){
    'ngInject';

    $reactive(this).attach($scope);
    this.subscribe("notification");
    this.helpers({
      usersOnline() {
        return Meteor.users.find({ "status.online": true })
      }
    });
  }

  sendCode(id, event){
    var note = {
      userId:id,
      notification: Meteor.user().profile.name + ' vừa mời bạn tham gia kì thi của anh ấy với mã: ' + Session.get('quizId'),
      date: new Date()
    }
    NotificationData.insert(note);
    Session.set('notificationId', id);
  }

  inviteAll(){
    var users = Meteor.users.find({ "status.online": true });
    users.forEach((user) => {
      if(user._id !== Meteor.userId()){
        var note = {
          userId: user._id,
          notification: Meteor.user().profile.name + ' vừa mời bạn tham gia kì thi của anh ấy với mã: ' + Session.get('quizId'),
          date: new Date()
        }
      NotificationData.insert(note);
    }
   });
  }
}

const name = 'sendCode';

export default  angular.module(name, [
    angularMeteor
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: SendCode
})
