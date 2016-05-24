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
    //chu y phai subscribe no
    this.subscribe("examination");
    this.helpers({
      infor()
      {

        return Examination.findOne({_id:$stateParams.exam_id});
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
    url: '/sored/:exam_id',
    template: '<scored-exam></scored-exam>'
  })
}
