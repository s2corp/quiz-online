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
           $state.go('home');
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
    //console.log(this.question_id);
    // var ans=Question.find({$and:[{"_id":this.question_id}
    //   ,{"questionSet": { $elemMatch: { "question":{$not:{$ne:que}},"correctAnswerSet":data}}}]}).count();
    //   console.log(ans);

    Meteor.call("checkanswer",this.question_id,que,data,vitri , function(error, result){
      if(error){
        console.log("error", error);
      }

      if(result){
      console.log("ket qua");
       console.log(result);
        Session.set("valueresult", result);
      }
    })
    

    console.log("correctAnswerSet");
    console.log(Session.get("valueresult"));
    // if(Session.get("valueresult") == null)
    //   console.log("null valueresult");


    //  console.log(ans.questionSet[vitri].scored);
      // if(ans > 0){
      //   console.log("dung");
      //
      //         this.score =this.score + val.questionSet[vitri].scored;
      //         Meteor.call("updateExam",this.exam_id,Meteor.userId(),this.score);
      //    }
      //    else {
      //      console.log("sai");
      //    }
          //console.log(val.questionSet.length);
        if (this.selectedIndex < (this.lengthquestion - 1)) {
          this.selectedIndex = this.selectedIndex + 1;
        }
        else {
          this.isend = false;
          //this.state.go('home');
          //this.state.go('scored-exam',{"exam_id":this.exam_id});
        }
        this.selectedRow = null;
      //  ans = null;
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
