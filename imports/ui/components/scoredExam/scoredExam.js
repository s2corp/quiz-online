import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import {Question} from '../../../api/question';
import {Examination} from '../../../api/examination';
import  mdDataTable from 'angular-material-data-table';
import './scoredExam.html';
class ScoredExam {
  constructor($scope,$reactive,$state,$stateParams) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe("examination");
    this.stateParams = $stateParams;
    this.exam_id=$stateParams.exam_id;
    this.examName;
    this.data = [];
    this.helpers({
      infor()
      {
        var tam1 = Examination.findOne({"_id":$stateParams.exam_id});
        Meteor.call("scoredUserInf",tam1, function(error, result){
          if(error){
              throw new Meteor.Error(505, 'Error');
          }
          if(result){
            Session.set("scoredUser", result);
          }
        });
        this.data =Session.get("scoredUser");
        return this.data;
      }
    });
  }
}
const name = "scoredExam";
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  ngMaterial,
  mdDataTable
])
.component(name,{
  templateUrl:'imports/ui/components/scoredExam/scoredExam.html',
  controllerAs: name,
  controller: ScoredExam
})
.config(config);
function config($stateProvider){
  'ngInject';
  $stateProvider
  .state('scored-exam', {
    url: '/scored/:exam_id',
    template: '<scored-exam></scored-exam>'
  })
}
