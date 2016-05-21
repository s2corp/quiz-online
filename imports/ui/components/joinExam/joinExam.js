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
    this.tam ;
  }
  loginExam(zipcode){
    if(Meteor.userId() === null)
      this.state.go("home");
      else {

        if (zipcode == null) {
          this.state.go("home");
        }
        else {
          //findOne thi moi truy van den con cua no va ko co fetch
          console.log(zipcode);

          var val  = Examination.findOne({"_id":zipcode},{fields:{'questionSetId':1,"_id":0}});
          if(val !== null)
          {
            //push mot doi usersList vao trong collection examination
            var checkexit = Examination.find({$and:[{_id:zipcode},{"usersList":{$elemMatch:{"userId":Meteor.userId()}}}]}).count();
            //neu userId da ton tai tron examination thi cap nhat lai diem so con neu chua thi tao mot truong moi
            console.log(checkexit);

          if(checkexit > 0){
              //neu da ton tai thi cap nhap lai diem = 0
              Meteor.call("updateExam",zipcode,Meteor.userId(),0);

            }
            else {
              Examination.update({_id:zipcode}, {$push:{
                "usersList":{"userId":Meteor.userId(),"scored":0}
              }});
            }
            //muon truyen nhieu dieu kien thi phai thuc hien o server dung methods o server va client thi goi lai
          //  Meteor.call("updateExam",zipcode,Meteor.userId(),0);
            this.tam=val.questionSetId;
            this.state.go("waitExam",{'exam_id':zipcode});
          }
            else {
                this.state.go("home");
            }
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
      template: '<join-exam></join-exam>'
    });
}
