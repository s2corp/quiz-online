import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './sendCodeButton.html';
import './sendCodeModal.html';
import { name as SendCode } from '../sendCode/sendCode';

class SendCodeButton {
  constructor($mdDialog, $mdMedia,$reactive,$scope) {
    'ngInject';
    $reactive(this).attach($scope);
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia
    this.helpers({
      rendered: function(){
        console.log(this.examid);
      }
    });

  }

  open(event) {
    this.$mdDialog.show({
      locals:{
        item:this.examid
      },
      controller($mdDialog,item,$reactive,$scope) {
        'ngInject';
        $reactive(this).attach($scope);
        this.item = item;
        console.log(this.item);

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
  bindings:{
    examid:'='
  },
  controllerAs: name,
  controller: SendCodeButton
});
