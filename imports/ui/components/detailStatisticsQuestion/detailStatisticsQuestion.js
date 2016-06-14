import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import {Questionstatistics} from '../../../api/questionstatistics';
import './detailStatisticsQuestion.html';
class DetailStatisticsQuestion {
  constructor($scope,$reactive,$state,$stateParams) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe("questionstatistics");
    this.stateParams = $stateParams;
    this.helpers({
      info: function(){
        Meteor.call("detailstatisQuestion", $stateParams.question_id, function(error, result){
          if(error){
            console.log("error", error);
          }
          if(result){
            Session.set("detailstatisquestion", result);

          }
        });
        var data= Session.get("detailstatisquestion");
        console.log(data);
        return data;
      },
      question(){
          return   Questionstatistics.findOne({_id:$stateParams.question_id});
      }
    });
  }
}
const name = "detailStatisticsQuestion";
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  ngMaterial
])
.component(name,{
  templateUrl:'imports/ui/components/detailStatisticsQuestion/detailStatisticsQuestion.html',
  controllerAs: name,
  controller: DetailStatisticsQuestion
})
.config(config);
function config($stateProvider){
  'ngInject';
  $stateProvider
  .state('detailStatisticsQuestion', {
    url: '/detailStatisticsQuestion/:question_id',
    template: '<detail-statistics-question></detail-statistics-question>'
  })
}
