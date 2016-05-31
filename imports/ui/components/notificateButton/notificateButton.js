import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './notificateButton.html';
import './notificateModal.html';
import { name as Notification } from '../notification/notification';
import { NotificationData } from '../../../api/notificationdata';

class NotificateButton {
  constructor($mdDialog, $mdMedia, $scope,$reactive) {
    'ngInject';
    $reactive(this).attach($scope);
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
    this.subscribe("notification");
    var query = NotificationData.find( { 'userId': Meteor.userId() } );
    var handle = query.observeChanges({
      added: function (id, user) {
        document.getElementById('noteButton').style.backgroundColor = 'red';
      },
      removed: function () {
        count--;
        console.log("Lost one. We're now down to " + count + " admins.");
      }
    });

    //setTimeout(function () {handle.stop();}, 5000);
  }

  open(event) {
    document.getElementById('noteButton').style.backgroundColor = 'transparent';
    this.$mdDialog.show({
      controller($mdDialog) {
        'ngInject';

        this.close = () => {
          $mdDialog.hide();
        }
      },
      controllerAs: 'notificateModal',
      templateUrl: `imports/ui/components/${name}/notificateModal.html`,
      targetEvent: event,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('lg')
    });
  }
}

const name = 'notificateButton';

// create a module
export default angular.module(name, [
  angularMeteor,
  Notification
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: NotificateButton
});
