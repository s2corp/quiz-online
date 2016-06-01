import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import {Question} from '../../../api/question';
import {Examination} from '../../../api/examination';
import './detailStatistics.html';
class DetailStatistics {
  constructor($scope,$reactive,$state,$stateParams) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe("examination");
    this.subscribe("question");
    this.stateParams = $stateParams;
    this.helpers({
      info: function(){
        Meteor.call("detailstatis", $stateParams.exam_id, function(error, result){
          if(error){
            console.log("error", error);
          }
          if(result){
            Session.set("detailstatis", result);

          }
        });
        var data= Session.get("detailstatis");
        console.log(data);
        return data;
      },
      exam(){
          return   Examination.findOne({_id:$stateParams.exam_id});
      }
    });
  }
}
const name = "detailStatistics";
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  ngMaterial
])
.component(name,{
  templateUrl:'imports/ui/components/detailStatistics/detailStatistics.html',
  controllerAs: name,
  controller: DetailStatistics
})
.config(config);
function config($stateProvider){
  'ngInject';
  $stateProvider
  .state('detailStatistics', {
    url: '/detailStatistics/:exam_id',
    template: '<detail-statistics></detail-statistics>'
  })
}
