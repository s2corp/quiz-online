import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './questionbank.html';
import { Question } from '../../../api/question'
import { QuestionBankData } from '../../../api/questionbankdata'

class QuestionBank {
  constructor($scope, $reactive){
    'ngInject';

    $reactive(this).attach($scope);
    this.subscribe("questionbankdata");

    //mã code tự sinh sử dụng cho id của bộ câu hỏi cộng đồng
    this.code = (Math.floor(Math.random()*99999) + 10000).toString();

    //sử dụng để hiện hoặc ẩn nội dung câu hỏi
    this.display = 'none';

    //lĩnh vực mà người dùng lựa chọn
    this.fields = '';

    //số lượng câu hỏi tối đa của lĩnh vực được chọn
    this.maxCount = 0;

    //chứa các câu hỏi đã chọn trong changeQuestion
    this.questionChose = [];

    //số lượng câu hỏi hiện tại
    this.questionCount = 0;

    //danh sách chứa tên các câu hỏi đã thêm
    this.questionName = [];

    //chứa tất cả nội dung của kì thi
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

  addQuestionPersonal(question){
    var questions = Question.find({'_id': question._id}).fetch();

    this.value.title = questions[0].title;
    this.value.questionSet = questions[0].questionSet;

    this.selectedTab = 2;

    Session.set('questionId', question._id);
    Session.set('questionCount', question.questionSet.length);
  }

  addQuestionPublic(){
    var randMax = Math.floor((Math.random() * 5) + 6) / 10;
    var randMin = Math.floor((Math.random() * 5) + 1) / 10;
    var questions = [];
    var count = 0;

    //lựa chọn các câu hỏi với lĩnh vực đã chọn
    while(count < this.questionCount){
      questions = QuestionBankData.find({'fields': this.fields, 'randomValue': {$gt: randMin}, 'randomValue': {$lt: randMax}} , {limit: this.questionCount});
      count = questions.count();
      randMin -= 0.0001;
      randMax += 0.0001;
    }

    //tạo phần tử của bảng Question
    var tempQues = [];
    questions.forEach((elem) => {
      tempQues.push(elem.question);
      this.questionName.push(elem.question.question);
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

  changeQuestion(question)
  {
    var index = 0;
    var rand = Math.random();
    var count = 0;

    for(i = 0; i < this.value.questionSet.length; i++)
      if(this.value.questionSet[i].question === question){
        index = i;
        break;
      }

    var questionResult = QuestionBankData.findOne( { 'fields': this.fields, 'question.question': {$nin: this.questionName}, 'question.question': {$nin: this.questionChose} } );
    this.questionChose.push(questionResult.question.question);
    if(this.questionChose.length === this.maxCount)
       this.questionChose = [];
    if(this.questionName.indexOf(questionResult.question.question) === -1){
      this.value.questionSet[index] = questionResult.question;
      this.questionName[index] = questionResult.question.question;
    }
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

   //sử dụng đối với câu hỏi cá nhân
   remove(questionId){
     Question.remove(questionId)
   }

   //sử dụng với câu hỏi cộng đồng
   removeQuestion(index){
    //  for(i = 0; i < this.value.questionSet.length; i++){
    //    if(this.value.questionSet[i].question === ques.question){
    //      var index = i;
         this.value.questionSet.splice(index, 1);
   }

   //hiện và ẩn nội dung ứng với một câu hỏi trong tab xem lại
   showhideQuestion(id){
    if(document.getElementById(id).style.display === 'none')
      document.getElementById(id).style.display = 'inline';
    else
      document.getElementById(id).style.display = 'none';
   }

   //hiển thị số lượng câu hỏi tối đa đối với một lĩnh vực được lựa chọn
   showMaxCount(){
     this.maxCount = QuestionBankData.find({'fields': this.fields}).count();
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
