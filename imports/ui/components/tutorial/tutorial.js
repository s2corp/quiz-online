import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import {Question} from '../../../api/question';
import {Examination} from '../../../api/examination';
import './tutorial.html';
class Tutorial {
  constructor($scope,$reactive,$state,$stateParams) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe("examination");
    this.stateParams = $stateParams;

  }
}
const name = "tutorial";
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  ngMaterial
])
.component(name,{
  templateUrl:'imports/ui/components/tutorial/tutorial.html',
  controllerAs: name,
  controller: Tutorial
})
.config(config);
function config($stateProvider){
  'ngInject';
  $stateProvider
  .state('tutorial', {
    url: '/tutorial',
    template: '<tutorial></tutorial>'
  })
}
