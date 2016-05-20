import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { name as Login } from '../login/login';
import { NotificationData } from '../../../api/lists/notification.js';
import './notification.html';

class Note{
  constructor($scope, $reactive){
    'ngInject';
    $reactive(this).attach($scope);
    this.helpers({
      notes() {
        if( NotificationData.find( { 'userId': Meteor.userId() } ).count() > 0 )
          return NotificationData.find( { 'userId': Meteor.userId() }, {sort: {date: -1}} );
      }
    });
  }

  removeNote(note){
    NotificationData.remove(note._id);
  }
}

const name = 'notification';

export default  angular.module(name, [
    angularMeteor,
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Note
})
