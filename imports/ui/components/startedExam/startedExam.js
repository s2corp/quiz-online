import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import  mdDataTable from 'angular-material-data-table';
import {Question} from '../../../api/question';
import {Examination} from '../../../api/examination';
// goi duoi server
import {Meteor} from 'meteor/meteor';
import './startedExam.html';
import {Session} from 'meteor/session';
class StartedExam {
  constructor($scope,$reactive,$stateParams,$state) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe('question');
    this.subscribe("examination");
    this.score=0;
    this.selectedIndex = 0 ;//hien ra cau hoi thu i
    this.isend = true;//kiem tra het cau hoi chua
    //note
    this.question_id=$stateParams.question_id;
    this.exam_id=$stateParams.exam_id;
    this.val;
    this.state=$state;
    this.selectedRow = null;
    this.lengthquestion = 0;
    var exam = Examination.findOne({_id:$stateParams.exam_id});
    if(exam !== null)
        Session.set("stoprun", exam.time);
    else {
        Session.set("stoprun", 60);
    }
    document.getElementById('time').innerHTML = Session.get("stoprun");
    //ham tu dong kiem tra thoi gian
    this.autorun(() =>{
      var isstop = Meteor.setInterval(function(){
        Meteor.call("timeRunOut", Session.get("stoprun"), function(error, result){
          if(error){
            console.log("error", error);
          }
            Session.set("stoprun", result);
        });
        if(Session.get("stoprun") < 1)
        {
          Meteor.clearInterval(isstop);
         $state.go("scored-exam",{"exam_id": $stateParams.exam_id});
        }
        else {
          document.getElementById('time').innerHTML = Session.get("stoprun");
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
        //  console.log(val);

          this.lengthquestion = val.questionSet.length;
          return Question.findOne({"_id":$stateParams.question_id});
        }
          else {
           this.state.go('home');
          }
    }
  });
  }
  //hien ra cau hoi thu index
  setClickedRow(index)
  {
      this.selectedRow = index;
  }


  checkanswer(que,data,vitri)
  {
    var userscored =
    Meteor.call("checkanswer",this.exam_id,Meteor.userId(),this.question_id,que,data,vitri , function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){
        //console.log(result);
        document.getElementById('scored').innerHTML = result;
        Session.set("scored", result);
      }
    });
    //chuyen sang cau hoi tiep theo
        if (this.selectedIndex < (this.lengthquestion - 1)) {
          this.selectedIndex = this.selectedIndex + 1;
        }
        else {
          this.isend = false;
          this.state.go('scored-exam',{"exam_id":this.exam_id});
        }
        this.selectedRow = null;
  }
}

const name = 'startedExam';
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  mdDataTable
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
            return $q.reject();
          }else {
            return $q.resolve();
          }
        }
      }
    })
}
