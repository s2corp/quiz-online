import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import {Question} from '../../../api/question';
import {Examination} from '../../../api/examination';

import './statistics.html';
class Statistics {
  constructor($scope,$reactive,$state,$stateParams) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe("examination");
    this.subscribe("question");
    this.stateParams = $stateParams;
    this.exam = $stateParams.exam_id  ;
    this.helpers({
      info: function(){
        Meteor.call("statis", $stateParams.exam_id, function(error, result){
          if(error){
            console.log("error", error);
          }
          if(result){
            Session.set("statis", result);
          }
        });
        var data= Session.get("statis");
        console.log(data);
        return data;
      }
    });
  }
}
const name = "statistics";
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  ngMaterial
])
.component(name,{
  templateUrl:'imports/ui/components/statistics/statistics.html',
  controllerAs: name,
  controller: Statistics
})
.config(config);
function config($stateProvider){
  'ngInject';
  $stateProvider
  .state('statistics', {
    url: '/statistics/:exam_id',
    template: '<statistics></statistics>'
  })
}
