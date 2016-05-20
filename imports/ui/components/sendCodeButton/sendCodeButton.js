import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './sendCodeButton.html';
import './sendCodeModal.html';
import { name as SendCode } from '../sendCode/sendCode';

class SendCodeButton {
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
      controllerAs: 'sendCodeModal',
      templateUrl: `imports/ui/components/${name}/sendCodeModal.html`,
      targetEvent: event,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('lg')
    });
  }
}

const name = 'sendCodeButton';

// create a module
export default angular.module(name, [
  angularMeteor,
  SendCode
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: SendCodeButton
});
