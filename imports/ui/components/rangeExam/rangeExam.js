import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import {Question} from '../../../api/question';
import {Examination} from '../../../api/examination';
import './rangeExam.html';
class RangeExam {
  constructor($scope,$reactive) {
    'ngInject';
    $reactive(this).attach($scope);
    this.subscribe("examination");
    this.data = [];
    this.helpers({
      infor()
      {
        console.log(this.exam);
         var tam1 = Examination.findOne({"_id":this.exam});
        Meteor.call("scoredUserInf",tam1, function(error, result){
          if(error){
            console.log("error", error);
          }
          if(result){
            Session.set("rangeExam", result);
          }
        });
        this.data =Session.get("rangeExam");
        return this.data;
      }
    });
  }
}

const name = 'rangeExam';

// create a module
export default angular.module(name, [
  angularMeteor,
  ngMaterial
]).component(name, {
  templateUrl: 'imports/ui/components/rangeExam/rangeExam.html',
  bindings:{
    exam:'='
  },
  controllerAs: name,
  controller: RangeExam
});
