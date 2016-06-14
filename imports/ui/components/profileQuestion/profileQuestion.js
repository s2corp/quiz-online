import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import {Question} from '../../../api/question';
import {Examination} from '../../../api/examination';
import  { name as profileExam} from '../profileExam/profileExam';
import { Questionstatistics } from '../../../api/questionstatistics';
import './profileQuestion.html';
class ProfileQuestion {
  constructor($scope,$reactive,$state,$stateParams) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe("questionstatistics");
    this.stateParams = $stateParams;
    this.show=false;
    this.helpers({
      exam(){
        var data = Questionstatistics.find({"userId":Meteor.userId()}, {
         sort: {
           date: -1
         }});
        return data;
      }
    });
  }

  showExam(index){
    if(document.getElementById(index).style.display === "none")
      document.getElementById(index).style.display = "inline";
    else {
      document.getElementById(index).style.display = "none";
    }
      //this.show = ! this.show;
  }
}
const name = "profileQuestion";
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  ngMaterial,
  profileExam
])
.component(name,{
  templateUrl:'imports/ui/components/profileQuestion/profileQuestion.html',
  controllerAs: name,
  controller: ProfileQuestion
})
.config(config);
function config($stateProvider){
  'ngInject';
  $stateProvider
  .state('profileQuestion', {
    url: '/profileQuestion',
    template: '<profile-question></profile-question>'
  })
}
