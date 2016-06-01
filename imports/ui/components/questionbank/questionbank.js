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

    //ẫn nút sửa và xóa nếu là câu hỏi cá nhân
    this.disableButton = false;

    //lĩnh vực mà người dùng lựa chọn
    this.fields = '';

    //số lượng câu hỏi tối đa của lĩnh vực được chọn
    this.maxCount = 0;

    //số lượng câu hỏi tối đa của người dùng
    this.maxUserCount = 0;

    //số lượng câu hỏi dễ
    this.easyCount = 0;

    //số lượng câu hỏi trung bình
    this.normalCount = 0;

    //số lượng câu hỏi khó
    this.hardCount = 0;

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
      date: new Date(),
      userId: Meteor.userId()
    }

    //xóa dữ liệu trong questionId
    delete Session.keys['questionId'];

    this.helpers({

      questions() {
        return Question.find({"userId": Meteor.userId()}, {sort: {date: -1}});
      },

      data() {
        var data = QuestionBankData.find().fetch();
        var distinctData = _.uniq(data, false, function(d) {return d.fields});
        var disctinctValues = _.pluck(distinctData, 'fields');
        return disctinctValues;
      },

      questionUsers() {
        this.questionSet = [];
        var questions = Question.find({"userId": Meteor.userId()}, {sort: {date: -1}}).fetch();

        for(i = 0; i < questions.length; i ++)
          for(j = 0; j < questions[i].questionSet.length; j++)
              this.questionSet.push ( questions[i].questionSet[j] );

        for(i = 0; i < this.questionSet.length - 1; i ++)
          for(j = i + 1; j < this.questionSet.length; j ++)
            if(this.questionSet[i].question === this.questionSet[j].question)
                this.questionSet.splice(j, 1);

        this.easySet = [];
        this.normalSet = [];
        this.hardSet = [];

        for(i = 0; i < this.questionSet.length; i++)
          if(this.questionSet[i].rate >= 0.6)
            this.easySet.push(this.questionSet[i]);
          else
            if(this.questionSet[i].rate >= 0.3)
              this.normalSet.push(this.questionSet[i]);
            else
              this.hardSet.push(this.questionSet[i]);

        this.maxEasy = this.easySet.length;
        this.maxNormal = this.normalSet.length;
        this.maxHard = this.hardSet.length;
        this.maxUserCount = this.questionSet.length;
      }
    });
  }

  addQuestionPersonal(question){
    var questions = Question.find({'_id': question._id}).fetch();

    this.value.title = questions[0].title;
    this.value.questionSet = questions[0].questionSet;

    this.selectedTab = 2;

    this.disableButton = true;

    Session.set('questionId', question._id);
    Session.set('questionCount', question.questionSet.length);
  }

  // addQuestionRandom(){
  //   var easySet = [];
  //   var normalSet = [];
  //   var hardSet = [];
  //
  //   for(i = 0; i < this.questionSet.length; i++)
  //     if(this.questionSet[i].rate >= 0.6)
  //       easySet.push(this.questionSet[i]);
  //     else
  //       if(this.questionSet[i].rate >= 0.3)
  //         normalSet.push(this.questionSet[i]);
  //       else
  //         hardSet.push(this.questionSet[i]);
  //
  // }

  addQuestionPublic(){
    this.questionChose = [];
    this.questionName = [];
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

    this.disableButton = false;

    this.changeTab();
  }

  //thêm câu hỏi vào bộ câu hỏi từ 1 hoặc nhiều đề
  addSubQuestion(question) {
    var index = -1
    for(i = 0; i < this.value.questionSet.length; i++){
      if(this.value.questionSet[i] === question)
        index = i;
    }
    if(index >= 0){
      this.value.questionSet.splice(index, 1);
    }
    else
      this.value.questionSet.push(question)
  }

  //thêm câu hỏi bằng chức năng chọn ngẫu nhiên của cá nhân
  addQuestionRandom() {
    this.value.questionSet = [];
    var randomIndexEasy = this.shuffle(this.maxEasy);
    var randomIndexNormal = this.shuffle(this.maxNormal);
    var randomIndexHard = this.shuffle(this.maxHard);

    var t = 0;
    for(i = 0; i < randomIndexEasy.length; i++)
    {
      this.value.questionSet.push(this.easySet[randomIndexEasy[i]]);
      t ++;
      if(t === this.easyCount)
        break;
    }

    t = 0;
    for(i = 0; i < randomIndexNormal.length; i++)
    {
      this.value.questionSet.push(this.normalSet[randomIndexNormal[i]]);
      t ++;
      if(t === this.normalCount)
        break;
    }

    t = 0;
    for(i = 0; i < randomIndexHard.length; i++)
    {
      this.value.questionSet.push(this.hardSet[randomIndexHard[i]]);
      t ++;
      if(t === this.hardCount)
        break;
    }

    this.selectedTab = 2;
    this.disableButton = true;
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

  countUserQuestion(){
    this.questionCount = this.easyCount + this.normalCount + this.hardCount;
  }

  changeTabPersonal(){
    this.selectedTab = 2;

    this.disableButton = true;
  }


  //sử dụng để lọc điều kiện tìm kiếm trong changeQuestion
  countValue(condition){
    var count = 1;
    for(i = 1; i < condition.length; i++)
        if(condition[i] !== condition[i - 1])
          count ++;
    return count;
  }

  changeQuestion(question)
  {

    var index = 0;
    var count = 0;

    for(i = 0; i < this.value.questionSet.length; i++)
      if(this.value.questionSet[i].question === question){
        index = i;
        break;
      }
    var condition = this.questionChose.concat(this.questionName);
    condition = this.filterData(condition);

    if(condition.length >= this.maxCount){
      this.questionChose = [];
      condition = this.questionChose.concat(this.questionName);
      condition = this.filterData(condition);
    }

    var questionResult = QuestionBankData.findOne( { 'fields': this.fields, 'question.question': {$nin: condition} } );

    if(questionResult)
    {
      if(this.questionChose.indexOf(questionResult.question.question) === -1)
        this.questionChose.push(questionResult.question.question);


      this.value.questionSet[index] = questionResult.question;
      this.questionName[index] = questionResult.question.question;
    }
    else {
      alert('bạn đã chọn tất cả câu hỏi hiện có');
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

   //lọc dữ liệu trùng lặp
   filterData(data){
    data.sort();
    for(i = 1; i < data.length; i ++) {
      if(data[i] === data[i - 1]){
        data.splice(i, 1);
        i --;
      }
    }
    return data;
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
    console.log(id);
    if(document.getElementById(id).style.display === 'none')
      document.getElementById(id).style.display = 'inline';
    else
      document.getElementById(id).style.display = 'none';
   }

   showhideQuestionSet(event){
    var id = event.target.id.toString() + '#'
    console.log(id);
    if(document.getElementById(id).style.display === 'none')
      document.getElementById(id).style.display = 'inline';
    else
      document.getElementById(id).style.display = 'none';
   }

   //hiển thị số lượng câu hỏi tối đa đối với một lĩnh vực được lựa chọn
   showMaxCount(){
     this.maxCount = QuestionBankData.find({'fields': this.fields}).count();
   }

  //tạo mảng vị trí random
  shuffle(count) {
    var array = [];
    for(i = 0; i < count; i++)
      array[i] = i
    var tmp, current, top = array.length;
    if(top) while(--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
    return array;
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
