import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import { Meteor } from 'meteor/meteor';
import {Examination} from '../../../api/examination';
import {Question} from '../../../api/question';
import {Session} from 'meteor/session';

//import { name as displayProfileUser } from '../../filters/displayProfileUser';
import './waitExam.html';
import '../../../api/users';
class WaitExam {
  constructor($scope,$reactive,$stateParams,$state,$compile) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe("usersList");//show all user
    this.subscribe("examination", () => [$stateParams.exam_id] );//phai subscribe
    this.subscribe("question");

    this.compile = $compile;
    this.scope = $scope;
    this.state = $state;
    this.stateParams = $stateParams;
    this.data = [];
    this.stop;
    var val ;

    this.helpers({
      userinfor(){
        //console.log("message");
        //var val = Exam.findOne({"_id":$stateParams.exam_id});

         this.val= Examination.findOne({_id:$stateParams.exam_id});
            Meteor.call("finduser", this.val.usersList, function(error, result){
              if(error){
                console.log("error", error);
              }
              Session.set("sang", result);
            });


        this.data = Session.get("sang");
        return this.data;
      },
      ownExam(){
        //var us = Examination.find({"field":value});
        console.log(this.val.questionSetId);
        var us = Question.find({"_id":this.val.questionSetId, "userId":Meteor.userId()}).count();
        console.log(us);
        if(us > 0)
          return true;
        return false;
      }
    });
}
  runTime()
  {
    Session.set("stopTime", 2);
    this.stop = Meteor.setInterval(function(){
      Meteor.call("timeRunOut", Session.get("stopTime"), function(error, result){
        if(error){
          console.log("error", error);
        }
          console.log(result);
          Session.set("stopTime", result);

      });
    }, 1000);
    this.autorun(function(){
      if(Session.get("stopTime") < 1)
      {
        Meteor.clearInterval(this.stop);
        //console.log(this.stateParams.exam_id);
        //console.log(this.val.questionSetId);

        this.state.go("startedExam",{'exam_id':this.stateParams.exam_id,'question_id':this.val.questionSetId});
        //this.state.go("home");
      }

    });
  }
}

const name = 'waitExam';
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  ngMaterial
])
.component(name,{
  templateUrl:'imports/ui/components/waitExam/waitExam.html',
  controllerAs: name,
  controller: WaitExam
})
.config(config);
function config($stateProvider){
  'ngInject';
  $stateProvider
  .state('waitExam',{
    url:'/waitExam/:exam_id',
    template:'<wait-exam></wait-exam>'
  })
}
