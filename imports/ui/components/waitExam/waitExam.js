import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import { Meteor } from 'meteor/meteor';
import {Examination} from '../../../api/examination';
import {Question} from '../../../api/question';
import {Session} from 'meteor/session';
import  mdDataTable from 'angular-material-data-table';
import { name as SendCodeButton } from '../sendCodeButton/sendCodeButton';
import './waitExam.html';
import '../../../api/users';
class WaitExam {
  constructor($scope,$reactive,$stateParams,$state) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe("usersList");//show all user
    this.subscribe("examination");//phai subscribe
    this.subscribe("question");
    this.scope=$scope;
    this.state = $state;
    this.stateParams = $stateParams;
    this.idExam = $stateParams.exam_id;
    this.data =[];
    this.start =true;
    this.own = false;
    this.statusExam = false;
    var query = Examination.find({"_id":$stateParams.exam_id});
     this.handle = query.observeChanges({
      changed: function (id, fields) {
        if(fields.started === true)
        {

          Session.set("stopTime", 10);
          var stop = setInterval(function(){
            Meteor.call("timeRunOut", Session.get("stopTime"), function(error, result){
              if(error){
                console.log("error", error);
              }
                Session.set("stopTime", result);
            });
          }, 1000);
          Meteor.autorun(function(){
            if(Session.get("stopTime") < 0)
            {

              clearInterval(stop);
              document.getElementById('wait').innerHTML ="Kì thi đang diễn ra.";
            }
            else {
              document.getElementById('wait').innerHTML ="Kì thi sẽ bắt đầu sau "+ Session.get("stopTime")+"s";
            }
          });
        }
    }
    });

    this.autorun(function(){
      if(Session.get("stopTime") < 0)
      {
        var val= Examination.findOne({_id:$stateParams.exam_id});
        var checkown = Question.find({$and:[{"_id":val.questionSetId},{"userId":Meteor.userId()}]}).count();
          if(checkown <= 0)
          {
              this.state.go("startedExam",{'exam_id':this.stateParams.exam_id,'question_id':val.questionSetId});
          }
          this.handle.stop();
      }
    });

    this.helpers({
      userinfor(){
      var exam = Examination.findOne({_id:$stateParams.exam_id});
      Meteor.call("finduser",exam, function(error, result){
        if(error){
          throw new Meteor.Error(505, 'Error');
        }
        if(result){
          Session.set("profileUser", result);
        }
      });
      var data = Session.get("profileUser");
      return data;
      },


      ownExam(){
        try {
          var exam2 = Examination.findOne({_id:$stateParams.exam_id});
          var us = Question.find({"_id":exam2.questionSetId, "userId":Meteor.userId()}).count();
          if(us > 0)
          {
            this.own = true;
          }
        } catch (e) {
          throw new  Meteor.Error(123, "Error");
        }

        return this.own;
      }
    });
}

  runTime()
  {
    this.statusExam = true;
    this.start = false;
    Examination.update({_id:this.stateParams.exam_id}, {$set:{
         "started":true
       }});
  }
}

const name = 'waitExam';
export default angular.module(name,[
  angularMeteor,
  uiRouter,
  ngMaterial,
  mdDataTable,
  SendCodeButton
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
