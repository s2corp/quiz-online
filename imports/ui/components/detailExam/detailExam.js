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
    this.exam_id=$stateParams.exam_id;
    this.state=$state;
    this.istest="false" ;
    this.isStart="false" ;
    this.helpers({
      exam: function(){
        var raceCursor = Examination.find({_id:$stateParams.exam_id});
        var races = raceCursor.fetch();
        for (var i=0; i<races.length; i++) {
          if(races[i].isTest === true)
            this.istest="true";
          if(races[i].started === true )
            this.isStart == true;
        }
        var data = races[0];
        return data;
      }
    });
  }
  save()
  {
    var test = false;
    var start = false;
    if(this.istest === "true")
      test = true;
    if(this.isStart === "true")
      start = true;
    Examination.update({_id:this.stateParams.exam_id}, {$set:{
      "examName":this.exam.examName,"examDescrip":this.exam.examDescrip,
      "started":start,"isTest":test,"usersList":[]
    }});
    // this.state.go("profileExam");
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
