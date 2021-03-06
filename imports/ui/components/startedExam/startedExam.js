import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import  mdDataTable from 'angular-material-data-table';
import {Question} from '../../../api/question';
import {Examination} from '../../../api/examination';
import {Questionstatistics} from '../../../api/questionstatistics';
// goi duoi server
import {Meteor} from 'meteor/meteor';
import './startedExam.html';
import {Session} from 'meteor/session';
import {name as rangeExamButton} from '../rangeExamButton/rangeExamButton';
class StartedExam {
  constructor($scope,$reactive,$stateParams,$state) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe('question');
    this.subscribe("examination");
    this.subscribe("questionstatistics");
    this.score=0;
    this.readonly=true;
    this.selectedIndex = 0 ;//hien ra cau hoi thu i
    this.isend = true;//kiem tra het cau hoi chua
    //note
    this.question_id=$stateParams.question_id;
    this.exam_id=$stateParams.exam_id;
    this.val;
    this.state=$state;
    this.selectedRow = null;
    this.lengthquestion = 0;
    this.total =1;
    document.getElementById('scored').innerHTML ="Điểm: 0";
    this.exam =  Examination.findOne({_id:$stateParams.exam_id});
    this.dataquestion =  Question.findOne({_id:$stateParams.question_id});
    if(this.exam !== null)
    {
      var time = this.exam.time * 60  -1;
      Session.set("stoprun", time);

    }
    else {
        Session.set("stoprun", 60);
    }
    this.changeTime(Session.get("stoprun"))

    var parent = this;
    //ham tu dong kiem tra thoi gian
    this.autorun(() =>{
      this.isstop =setInterval(function(){
        Meteor.call("timeRunOut", Session.get("stoprun"), function(error, result){
          if(error){
            console.log("error", error);
          }
            Session.set("stoprun", result);
        });

        if(Session.get("stoprun") <= 0)
        {

          parent.updateStatic();
          clearInterval(parent.isstop);
          this.stop();
         $state.go("scored-exam",{"exam_id":$stateParams.exam_id});
        }
        else {
          var mi,sec;
          var timeRunning =parseInt(Session.get("stoprun"));
          mi =parseInt(timeRunning / 60);
          sec = timeRunning % 60;
         document.getElementById('time').innerHTML = mi+":"+sec;
        }
      },1000);
    });

    this.helpers({
      getuser(){
        if(Meteor.userId() === null)
        {
            this.state.go("home");
        }
      },
      showquestion(){
        if(Question.find({"_id":$stateParams.question_id}).count() > 0)
        {
          val=Question.findOne({"_id":$stateParams.question_id});
          this.lengthquestion = val.questionSet.length;
          return Question.findOne({"_id":$stateParams.question_id});
        }
          else {
           this.state.go('home');
          }
    },
    totalquestion()
    {
      var data = Question.find({"_id":$stateParams.question_id}).fetch();
      var t = data[0].questionSet.length;
      return t;
    }
  });
  }

  updateStatic()
  {
    if(this.exam.isTest === true)
    {
      Meteor.call("updateStaticQuestion", this.question_id,this.exam_id, function(error, result){
        if(error){
          console.log("error", error);
        }
        if(result){

        }
      });
    }
  }

  changeTime(time)
  {
    var mi,sec;
    mi =parseInt(time / 60);
    sec = time % 60;
   document.getElementById('time').innerHTML = mi+":"+sec;
 }
  //hien ra cau hoi thu index
  setClickedRow(index)
  {
      this.selectedRow = index;
  }


  checkanswer(que,correct,data,vitri)
  {
    if(document.getElementById('soundIndex') !== null) {
      document.getElementById('soundIndex').pause();
      document.getElementById('soundIndex').currentTime=0;
    }
    this.total = this.total + 1;
    if(que !== null && data !==null && vitri !==null && correct === data)
    {
      Meteor.call("checkanswer",this.exam_id,Meteor.userId(),this.question_id,que,data,vitri , function(error, result){
        if(error){
          console.log("error", error);
        }
        if(result){
          //console.log(result);
          document.getElementById('scored').innerHTML ="Điểm:"+ result;
          Session.set("scored", result);
        }
      });
      this.updateStatic();
    }
    //chuyen sang cau hoi tiep theo
        if (this.selectedIndex < (this.lengthquestion - 1)) {
          this.selectedIndex = this.selectedIndex + 1;
        }
        else {
          this.isend = false;
        //  this.updateStatic();
          clearInterval(this.isstop);
          this.state.go('scored-exam',{"exam_id":this.exam_id});
        }
        this.selectedRow = null;
  }
}

const name = 'startedExam';
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  mdDataTable,
  rangeExamButton
])
.component(name,{
  templateUrl:'imports/ui/components/startedExam/startedExam.html',
  controllerAs: name,
  controller: StartedExam
})
.config(config);
function config($stateProvider){
  'ngInject';
  $stateProvider
    .state('startedExam', {
      url: '/startedExam/:exam_id/:question_id',
      template: '<started-exam></started-exam>',
      resolve: {
        currentUser($q){
          if(Meteor.userId() === null){
            return $q.reject('AUTH_REQUIRED');
          }else {
            return $q.resolve();
          }
        }
      }
    })
}
