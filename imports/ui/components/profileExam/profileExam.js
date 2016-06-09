import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import {Question} from '../../../api/question';
import {Examination} from '../../../api/examination';
import './profileExam.html';
class ProfileExam {
  constructor($scope,$reactive,$state,$stateParams) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe("examination");
    this.stateParams = $stateParams;
    this.helpers({
      exam(){
        var data = Examination.find({"userId":Meteor.userId()});
        return data;
      }
    });
  }
}
const name = "profileExam";
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  ngMaterial
])
.component(name,{
  templateUrl:'imports/ui/components/profileExam/profileExam.html',
  controllerAs: name,
  controller: ProfileExam
})
.config(config);
function config($stateProvider){
  'ngInject';
  $stateProvider
  .state('profileExam', {
    url: '/profileExam',
    template: '<profile-exam></profile-exam>'
  })
}
