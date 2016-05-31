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
        // console.log($stateParams.question_id);
        //
        // var data = Question.findOne({_id:$stateParams.question_id});
        // console.log(data);
        Meteor.call("detailstatis", $stateParams.question_id, function(error, result){
          if(error){
            console.log("error", error);
          }
          if(result){
            Session.set("detailstatis", result);

          }
        });
        var data= Session.get("detailstatis");
        console.log(data);


        //console.log(data.questionSet.length);

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
    url: '/detailStatistics/:question_id',
    template: '<detail-statistics></detail-statistics>'
  })
}
