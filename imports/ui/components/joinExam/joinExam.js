import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import mdDataTable from 'angular-material-data-table';
import './joinExam.html';
import {Question} from '../../../api/question';
import {Examination} from '../../../api/examination';
import {Meteor} from 'meteor/meteor';
class JoinExam {
  constructor($scope,$reactive,$state,$stateParams) {
    'ngInject';
    $reactive(this).attach($scope);
    this.state = $state;
    this.subscribe("question");
    this.subscribe("examination");
    var queryExam;
  }

  loginExam(zipcode){
    queryExam = Examination.findOne({_id:zipcode});
    if(queryExam)
    {
      if(queryExam.isTest === true)
      {
        var val  = Examination.find({$and:[{"_id":zipcode},{"started":false}]},{fields:{'questionSetId':1,"_id":0}}).count();
        if(val > 0){
          this.updateUserExam(zipcode);
          this.state.go("waitExam",{'exam_id':zipcode});
        }
        else {
          alert("Xin lỗi! Kì thi đang diễn ra hoặc đã kết thúc");
        }
      }
      else {
        this.updateUserExam(zipcode);
        var checkown = Question.find({"_id":queryExam.questionSetId,"userId":Meteor.userId()}).count();
          if(checkown > 0)
            this.state.go("scored-exam",{"exam_id":zipcode});
            else {
              this.state.go("startedExam",{'exam_id':zipcode,'question_id':queryExam.questionSetId});
            }
      }
    }
    else {
      alert("Kì thi không tồn tại! Vui lòng kiểm trả lại mã kì thi.")
    }

  }

  updateUserExam(zipcode)
  {
    var checkisownQuestion = Question.find({$and:[{"_id":queryExam.questionSetId},{"userId":Meteor.userId()}]}).count();
    if(checkisownQuestion === 0)
    {
      var checkexit = Examination.find({$and:[{_id:zipcode},{"usersList":{$elemMatch:{"userId":Meteor.userId()}}}]}).count();
      if(checkexit > 0){
        Meteor.call("updateExam",zipcode,Meteor.userId(),0);
      }
      else {
        Examination.update({_id:zipcode}, {$push:{
          "usersList":{"userId":Meteor.userId(),"score":0}
        }});
      }
    }
  }

}
const name = 'joinExam';
export default angular.module(name,[
  angularMeteor,
  ngMaterial,
  uiRouter,
  mdDataTable
])
.component(name,{
  templateUrl:'imports/ui/components/joinExam/joinExam.html',
  controllerAs: name,
  controller: JoinExam
})
.config(config);
function config($stateProvider){
  'ngInject';
  $stateProvider
    .state('joinExam', {
      url: '/joinExam',
      template: '<join-exam></join-exam>',
      resolve: {
        currentUser($q) {
          if(Meteor.userId() === null)
            return $q.reject('AUTH_REQUIRED');
          if(Meteor.user().emails)
            if(!Meteor.user().emails[0].verified)
              return $q.reject('VERTIFICATE_REQUIRED');
          return $q.resolve();
        }
      }
    });
}
