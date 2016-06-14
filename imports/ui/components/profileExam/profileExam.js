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
        var data = Examination.find({"questionSetId":this.questionid}, {
         sort: {
           date: -1
         }});
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
  bindings:{
    questionid:'='
  },
  controllerAs: name,
  controller: ProfileExam
})
