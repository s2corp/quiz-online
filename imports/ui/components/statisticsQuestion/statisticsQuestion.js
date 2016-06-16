import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import {Questionstatistics} from '../../../api/questionstatistics';

import './statisticsQuestion.html';
class StatisticsQuestion {
  constructor($scope,$reactive,$state,$stateParams) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe("questionstatistics");
    this.stateParams = $stateParams;
    this.question_id = $stateParams.question_id;
    this.flat = false;
    // google.charts.load('current', {'packages':['corechart']});//chi load mot lan trong maincomponents
    this.helpers({
      info: function(){
        Meteor.call("statisQuestion", $stateParams.question_id, function(error, result){
          if(error){
            throw new Meteor.Error(505, 'Error');
          }
          if(result){
            Session.set("statisquestion", result);
          }
        });
        var data= Session.get("statisquestion");
        var arr = [];
        var index = 0;
        for(key in data)
          {
              arr[index]=data[key];
              index++;
          }
          var veryeasy = arr[0];
          var easy = arr[1];
          var normal = arr[2];
          var hardly = arr[3];
          var veryhardly = arr[4];

          if((veryeasy !==0 && veryeasy!==null) || (easy !==0 && easy!==null) || (normal !==0 && normal!=null ) || (hardly !==0 && hardly!=null) || (veryhardly !==0 && veryhardly!=null))
          {
            this.flat = true;
          }
           this.drawPie(veryeasy,easy,normal,hardly,veryhardly);
        return data;
      },
    question(){
       return Questionstatistics.findOne({_id:$stateParams.question_id});
    }
    });
  }
  drawPie(veryeasy,easy,normal,hardly,veryhardly){
    // console.log(easy + " "+ normal + " " + hardly);

    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var data = google.visualization.arrayToDataTable([
        ['Kì thi', 'Tỷ lệ %'],
        ['Rất dễ',  veryeasy],
        ['Dễ',   easy],
        ['Trung bình',   normal],
        ['Khó',  hardly],
        ['Rất khó',  veryhardly]
      ]);

      var options = {
        title: 'BIỂU ĐỒ MỨC ĐỘ CÂU HỎI'
      };

      var chart = new google.visualization.PieChart(document.getElementById('piechart'));

      chart.draw(data, options);
    }
  }
}
const name = "statisticsQuestion";
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  ngMaterial
])
.component(name,{
  templateUrl:'imports/ui/components/statisticsQuestion/statisticsQuestion.html',
  controllerAs: name,
  controller: StatisticsQuestion
})
.config(config);
function config($stateProvider){
  'ngInject';
  $stateProvider
  .state('statisticsQuestion', {
    url: '/statisticsQuestion/:question_id',
    template: '<statistics-question></statistics-question>'
  })
}
