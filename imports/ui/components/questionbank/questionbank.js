import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './questionbank.html';
import { Question } from '../../../api/lists/question.js'
import { QuestionBankData } from '../../../api/lists/questionbankdata.js'

class QuestionBank {
  constructor($scope, $reactive){
    'ngInject';

    $reactive(this).attach($scope);
    this.code = (Math.floor(Math.random()*99999) + 10000).toString();
    this.questionCount = 0;
    this.fields = '';

    this.value = {
      _id: this.code,
      title: 'câu hỏi cộng đồng',
      questionSet: [],
      date: new Date()
    }

    this.helpers({
      questions() {
        return Question.find({"userId": Meteor.userId()});
      },
      data() {
        var data = QuestionBankData.find().fetch();
        var distinctData = _.uniq(data, false, function(d) {return d.fields});
        var disctinctValues = _.pluck(distinctData, 'fields');
        return disctinctValues;
      }
    });
  }

  remove(questionId){
    Question.remove(questionId)
  }

  addQuestionPersonal(question){
    var questions = Question.find({'_id': question._id}).fetch();

    this.value.questionSet = questions[0].questionSet;

    this.selectedTab = 2;

    Session.set('questionId', question._id);
    Session.set('questionCount', question.questionSet.length);
  }

  addQuestionPublic(){
    //lựa chọn các câu hỏi với lĩnh vực đã chọn
    var questions = QuestionBankData.find({'fields': this.fields}, {limit: this.questionCount});

    //tạo phần tử của bảng Question
    var tempQues = [];
    questions.forEach((elem) => {
      tempQues.push(elem.question);
    });
    this.value.questionSet = tempQues;

    this.changeTab();
  }

  changeTab()
  {
    if(this.myForm.$valid)
        if (this.selectedTab === 2) {
            this.selectedTab = 0;
        }
        else {
            this.selectedTab++;
        }
  }

  buildTest(){

    //insert phần tử vào bảng Question
    var data = angular.copy(this.value);
    this.cleanupAngularObject(data);

    if(!Session.get('questionId')){
      Question.insert(data);

      Session.set('questionId', data._id);
      Session.set('questionCount', data.questionSet.length);
    }

    Session.set('selectedTab', '2');
    
    //reset data
    this.value = {};
  }

  //clean up data
  cleanupAngularObject(value)
  {
    if (value instanceof Array) {
        for (var i = 0; i < value.length; i++) {
              this.cleanupAngularObject(value[i]);
         }
    }
    else if (value instanceof Object) {
         for (property in value) {
             if (/^\$+/.test(property)) {
                 delete value[property];
             }
             else {
                 this.cleanupAngularObject(value[property]);
             }
         }
     }
   }


}

const name='questionbank';

export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: QuestionBank
})
//   .config(config);
//
// function config($stateProvider) {
//   'ngInject';
//   $stateProvider
//   	.state('manageQuestion', {
//   		url: '/manageQuestion',
//   		template: '<managequestion></managequestion>'
//   	});
// }
