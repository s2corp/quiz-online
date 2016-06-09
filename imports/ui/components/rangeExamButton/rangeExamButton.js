import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './rangeExamButton.html';
import './rangeExamModal.html';
import {name as rangeExam} from "../rangeExam/rangeExam";
class RangeExamButton {
  constructor($mdDialog, $mdMedia,$scope,$reactive) {
    'ngInject';
    $reactive(this).attach($scope);
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
    this.helpers({
      loading(){
        return this.data;
      }
    });

  }
    open(event) {
    this.$mdDialog.show({
      locals:{
        item:this.data
      },
      controller($mdDialog,$scope,$reactive,item) {
        'ngInject';
        $reactive(this).attach($scope);
        this.item = item;
        this.close = () => {
          $mdDialog.hide();
        }
      },
      controllerAs: 'rangeExamModal',
      templateUrl: 'imports/ui/components/rangeExamButton/rangeExamModal.html',
      targetEvent: event,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen:this.$mdMedia('sm') || this.$mdMedia('xs')
    });
  }
}

const name = 'rangeExamButton';

// create a module
export default angular.module(name, [
  angularMeteor,
  rangeExam
]).component(name, {
  templateUrl: 'imports/ui/components/rangeExamButton/rangeExamButton.html',
  bindings:{
    data:'='
  },
  controllerAs: name,
  controller: RangeExamButton
});
