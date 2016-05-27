import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './sendMailButton.html';
import './sendMailModal.html';
import { name as SendMail } from '../sendMail/sendMail';

class SendMailButton {
  constructor($mdDialog, $mdMedia) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia
  }

  open(event) {
    this.$mdDialog.show({
      controller($mdDialog) {
        'ngInject';

        this.close = () => {
          $mdDialog.hide();
        }
      },
      controllerAs: 'sendMailModal',
      templateUrl: `imports/ui/components/${name}/sendMailModal.html`,
      targetEvent: event,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('lg')
    });
  }
}

const name = 'sendMailButton';

// create a module
export default angular.module(name, [
  angularMeteor,
  SendMail
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: SendMailButton
});
