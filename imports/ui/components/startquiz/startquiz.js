import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './startquiz.html';
import { Session } from 'meteor/session';
import { Question } from '../../../api/question';
import { Notification } from '../../../api/notificationdata';
import { Examination } from '../../../api/examination';
import { QuestionBankData } from '../../../api/questionbankdata'
import { name as AddTest } from '../addtest/addtest.js';
import { name as QuestionBank } from '../questionbank/questionbank.js';
import { name as SendCodeButton } from '../sendCodeButton/sendCodeButton';
Meteor.subscribe('userStatus')

class StartQuiz{
  constructor($scope, $reactive){
    'ngInject';

    $reactive(this).attach($scope);
    this.subscribe("question");
    this.subscribe("notification");
    this.subscribe("examination");
    this.subscribe("questionbankdata");
    this.usersCount = 0;
    this.code = (Math.floor(Math.random()*99999) + 10000).toString();
    this.fields = ''
    this.data = {
        _id: this.code,
        date: new Date(),
        examName: '',
        isTest: true,
        questionSetId: '',
        questionCount: 0,
        usersList: [],
        reallyCount: 0,
        started: false,
        time: 0,
        userCount: 50,
    };
    this.disable = false;

    this.data.reallyCount = this.data.usersList.length;

    this.autorun(() => {
      if(Session.get('selectedTab')){
        this.selectedTab = parseInt(Session.get('selectedTab'));
        Session.set('selectedTab', 0);
      }
    });
  }

  changeTabCreate() {
    if(this.myForm.$valid)
        if (this.selectedTab === 1) {
            this.selectedTab = 0;
        }
        else {
            this.selectedTab++;
        }
    document.getElementById('addtest').style.display = 'inline';
    document.getElementById('questionbank').style.display = 'none';
    document.getElementById('share').style.visibility = 'visible';
    //Session.set('quizData', this.data);
  }

  changeTabBank() {
    if(this.myForm.$valid)
        if (this.selectedTab === 1) {
            this.selectedTab = 0;
        }
        else {
            this.selectedTab++;
        }
    document.getElementById('questionbank').style.display = 'inline';
    document.getElementById('addtest').style.display = 'none';
    document.getElementById('share').style.visibility = 'hidden';
    //Session.set('quizData', this.data);
  }

  foreChange()
  {
    if(!this.myForm.$valid)
     this.selectedTab = 0;
    document.getElementById('Error').style.display = 'none';
  }

  insertExam(){
    if(this.myForm.$valid)
    {
      if(Session.get('questionId'))
      {
        this.data.questionSetId = Session.get('questionId');
      }

      if(Session.get('questionCount')){
        this.data.questionCount = Session.get('questionCount');
      }

      this.data.userId = Meteor.userId();
      this.data.isTest = (this.data.isTest === 'true');
      if(this.data.questionSetId)
      {
        //thêm kì thi vào bảng examination
        Examination.insert(this.data);
        Session.set('quizId', this.data._id);

        //thêm câu hỏi vào ngân hàng câu hỏi
        if(this.public && this.fields != ''){
          var quesdata = Question.find({_id: this.data.questionSetId}).fetch();
          console.log(quesdata[0]);
          console.log(quesdata[0].questionSet);
          quesdata[0].questionSet.forEach((elem) => {
            var data = {
              fields: this.fields,
              question: elem,
              //được sử dụng để hiển thị kết quả ngẫu nhiên
              randomValue: Math.random()
            }
            QuestionBankData.insert(data);
          });
        }

        //reset dữ liệu
        this.data = {};
        document.getElementById('send-code').style.display='inline';
      }
      else
        document.getElementById('Error').style.display = 'inline';
    }
  }

  publicQuestion(){
    if(this.public)
      document.getElementById('questionFields').style.display = 'inline';
    else
      document.getElementById('questionFields').style.display = 'none';
  }
}

const name='startquiz';

export default angular.module(name, [
  angularMeteor,
  AddTest,
  QuestionBank,
  SendCodeButton
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: StartQuiz
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
  	.state('startQuiz', {
  		url: '/startQuiz',
  		template: '<startquiz></startquiz>',
      resolve: {
      currentUser($q) {
        if(Meteor.userId() === null)
          return $q.reject('AUTH_REQUIRED');
        else
          if(Meteor.user().profile.job !== 'teacher')
            return $q.reject('JOB_REQUIRED');
          else
            if(!Meteor.user().emails[0].verified)
              return $q.reject('VERTIFICATE_REQUIRED');
            else
              return $q.resolve();
        }
      }
  	});
}
