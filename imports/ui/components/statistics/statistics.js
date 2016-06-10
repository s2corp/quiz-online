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
    this.exam = $stateParams.exam_id;
    google.charts.load('current', {'packages':['corechart']});//onload pie
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
        var arr = [];
        var index = 0;
        for(key in data)
          {
              arr[index]=data[key];
              index++;
          }
          var easy = arr[0];
          var normal = arr[1];
          var hardly = arr[2];
          this.drawPie(easy,normal,hardly);
      }
    });
  }
  drawPie(easy,normal,hardly){
    // console.log(easy + " "+ normal + " " + hardly);

    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ['Dễ',     easy],
        ['Trung bình',      normal],
        ['Khó',  hardly]
      ]);

      var options = {
        title: 'MỨC ĐỘ ĐỀ THI'
      };

      var chart = new google.visualization.PieChart(document.getElementById('piechart'));

      chart.draw(data, options);
    }
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
