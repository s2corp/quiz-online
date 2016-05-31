import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import {Question} from '../../../api/question';
import {Examination} from '../../../api/examination';
import './detailExam.html';
class DetailExam {
  constructor($scope,$reactive,$state,$stateParams) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe("examination");
    this.stateParams = $stateParams;
    this.helpers({
      exam: function(){
        var data =Examination.findOne({_id:$stateParams.exam_id});
        return data;
      }
    });
  }
}
const name = "detailExam";
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  ngMaterial
])
.component(name,{
  templateUrl:'imports/ui/components/detailExam/detailExam.html',
  controllerAs: name,
  controller: DetailExam
})
.config(config);
function config($stateProvider){
  'ngInject';
  $stateProvider
  .state('detailExam', {
    url: '/detailExam/:exam_id',
    template: '<detail-exam></detail-exam>'
  })
}
