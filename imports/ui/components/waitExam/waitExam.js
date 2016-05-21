import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import { Meteor } from 'meteor/meteor';
import {Examination} from '../../../api/examination';
import {Session} from 'meteor/session';
//import { name as displayProfileUser } from '../../filters/displayProfileUser';
import './waitExam.html';
import '../../../api/users';
class WaitExam {
  constructor($scope,$reactive,$stateParams,$state,$compile) {
    'ngInject';
    $reactive(this).attach($scope);
    this.stateParams =$stateParams;
    this.subscribe("usersList");//show all user
    this.subscribe("examination");//phai subscribe
    this.compile=$compile;
    this.scope=$scope;
    this.data =[];
    this.helpers({
      userinfor(){
        //console.log("message");
        //var val = Exam.findOne({"_id":$stateParams.exam_id});
        //console.log(val);
        var val= Examination.findOne({_id:$stateParams.exam_id});
            Meteor.call("finduser", val.usersList, function(error, result){
              if(error){
                console.log("error", error);
              }
              Session.set("sang", result);
            });


        this.data = Session.get("sang");
            //this.data.push(Meteor.call("finduser", val.usersList[i].userId));
        console.log("message");

        console.log(this.data);
        return this.data;
        }
    });
}}

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
