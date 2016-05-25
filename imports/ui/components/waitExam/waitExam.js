import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import { Meteor } from 'meteor/meteor';
import {Examination} from '../../../api/examination';
import {Question} from '../../../api/question';
import {Session} from 'meteor/session';
import  mdDataTable from 'angular-material-data-table';
//import { name as displayProfileUser } from '../../filters/displayProfileUser';
import './waitExam.html';
import '../../../api/users';
class WaitExam {
  constructor($scope,$reactive,$stateParams,$state,$compile) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe("usersList");//show all user
    this.subscribe("examination");//phai subscribe
    this.subscribe("question");
    this.compile=$compile;
    this.scope=$scope;
    this.state = $state;
    this.stateParams = $stateParams;
    this.data =[];
    this.stop;
    this.val= Examination.findOne({_id:$stateParams.exam_id});
    var questionID = this.val.questionSetId;
    this.start =false;
    this.statusExam = false;
    this.time =10;
    var query = Examination.find({"_id":$stateParams.exam_id});
    var handle = query.observeChanges({
      changed: function (id, fields) {
        if(fields.started === 1)
        {
              var checkown = Question.find({"_id":questionID,"userId":Meteor.userId()}).count();
                if(checkown > 0)
                  $state.go("scored-exam",{"exam_id":$stateParams.exam_id});
                  else {
                    $state.go("startedExam",{'exam_id':$stateParams.exam_id,'question_id':questionID});
                  }
        }
      }
    });
    this.helpers({
      userinfor(){
            Meteor.call("finduser", this.val.usersList, function(error, result){
              if(error){
                console.log("error", error);
              }
              Session.set("profileUser", result);
            });
        this.data = Session.get("profileUser");
        return this.data;
      },
      ownExam(){
        var us = Question.find({"_id":this.val.questionSetId, "userId":Meteor.userId()}).count();
        if(us > 0)
          this.start = true;
        return this.start;
      }
    });
}

  runTime()
  {
    this.statusExam = true;
    this.start = false;
    Session.set("stopTime", this.time);
    this.stop = Meteor.setInterval(function(){
      Meteor.call("timeRunOut", Session.get("stopTime"), function(error, result){
        if(error){
          console.log("error", error);
        }
          Session.set("stopTime", result);
      });
    }, 1000);
    this.autorun(function(){
      if(Session.get("stopTime") < 1)
      {
        Meteor.clearInterval(this.stop);
        Examination.update({_id:this.stateParams.exam_id}, {$set:{
          "started":1
        }});
      }
      else {
        document.getElementById('wait').innerHTML = Session.get("stopTime");
      }
    });
  }
}

const name = 'waitExam';
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  ngMaterial,
  mdDataTable
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
