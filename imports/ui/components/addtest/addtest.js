import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import { Question } from '../../../api/lists/question';

import './addtest.html';
//import { Users } from '../../../api/lists/user.js';


class AddTest {
  constructor($scope, $reactive, $compile, $sce) {
    'ngInject';

    $reactive(this).attach($scope);
    this.data = {
      questionSet: [
        {
          question: '',
          answerSet: [],
          corectAnswerSet: [],
          score: 0,
        }
      ],
      deadline: 30,
      redo: false,
      random: false
    };
    //this.data.date = new Date();
    //this.data.deadline = 30;
    this.answer = 0;
    this.question = 0;
    this.compile = $compile;
    this.scope = $scope;
  }

  //thêm đáp án
  appendAnswer(event)
  {
    var answer = this.data.questionSet[this.question].answerSet.length;
    var anString =
    '<div id=answer'+ this.question + '_' + answer + '>' +
      '<md-input-container class="md-block" flex-gt-sm>' +
        '<label>câu trả lời ' + answer + '</label>' +
        '<input ng-model="addtest.data.questionSet[' + this.question + '].answerSet[' + answer + ']">' +
      '</md-input-container>' +
      '<button id="#answer' + this.question + '_' + answer + '" ng-click="addtest.removeAnswer($event)">X</button>' +
    '</div>';
    var myEl = angular.element( document.querySelector( event.target.id) );
    myEl.append(this.compile(anString)(this.scope));
  }

  //xóa đáp án
  removeAnswer(event)
  {
    var answerIndex = parseInt(event.target.id.charAt(9));
    var questionIndex = parseInt(event.target.id.charAt(7));
    var myEl = angular.element( document.querySelector( event.target.id) );

    myEl.remove();
    this.data.questionSet[questionIndex].answerSet[answerIndex] = '';
  }

  //thêm câu hỏi
  appendQuestion()
  {
    var question = {
        question: '',
        answerSet: [],
        corectAnswerSet: [],
        score: 0,
    }

    this.data.questionSet.push(question);
    this.question ++;
    this.answer = 0;
    var quesString = '<br><md-content id="question' + this.question + '" class="md-padding" style="background-color: rgb(209, 223, 227)">' +
                                '<md-input-container class="md-block" flex-gt-sm>' +
                                      '<label>Câu hỏi thứ ' + this.question + '</label>' +
                                      '<input ng-model="addtest.data.questionSet[' + this.question + '].question">' +
                                '</md-input-container>' +
                                '<br>' +
                                '<div id="answer' + this.question + '" layout-gt-sm="column">' +
                                  '<div id=answer'+ this.question + '_' + this.answer + '>' +
                                    '<md-input-container class="md-block" flex-gt-sm>' +
                                          '<label>Câu trả lời 1</label>' +
                                          '<input ng-model="addtest.data.questionSet[' + this.question + '].answerSet[0]">' +
                                    '</md-input-container>' +
                                    '<button id="#answer' + this.question + '_' + this.answer + '" ng-click="addtest.removeAnswer($event)">X</button>' +
                                  '</div>' +
                                '</div>' +
                                '<button id="#answer'+ this.question + '" class="md-primary md-hue-1" ng-click="addtest.appendAnswer($event)">Thêm câu trả lời</button>' +
                                '<button id="#question' + this.question + '" class="md-primary md-hue-1" ng-click="addtest.removeQuestion($event)">Xóa câu hỏi</button>' +
                          '</md-content>';
    var myEl = angular.element( document.querySelector( '#questionSet' ) );
    myEl.append(this.compile(quesString)(this.scope));
  }

  //xóa câu hỏi
  removeQuestion(event)
  {
    var questionIndex = parseInt(event.target.id.charAt(9));
    var myEl = angular.element( document.querySelector( event.target.id) );

    myEl.remove();
    this.data.questionSet[questionIndex] = null;
  }

  //thêm đáp án
  updateCorrectAnswer(answer, correctAnswerSet)
  {
    var index = -1
    correctAnswerSet.forEach((elem) => {
      if(elem == answer){
        index = correctAnswerSet.indexOf(elem);
      }
    });
    if(index != -1)
      correctAnswerSet.splice(index, 1);
    else
      correctAnswerSet.push(answer);
  }

  //thêm đề
  addTest()
  {

    this.data.questionSet.forEach((elem) => {
      if(elem == null){
        var index = this.data.questionSet.indexOf(elem);
        this.data.questionSet.splice(index, 1)
      }
      elem.answerSet.forEach((answer) => {
        if(answer == ''){
          var index = elem.answerSet.indexOf(answer);
          elem.answerSet.splice(index, 1);
        }
      });
    });
    document.getElementById('answerWaring').style.visibility = 'hidden';
    //document.getElementById('correctAnswer').style.visibility = 'visible';
  }

  buildTest()
  {
    //thêm id của user đang đăng nhập
    if(Meteor.userId() != null)
      this.data.userId = Meteor.userId();

    //thêm ngày
    this.data.date = new Date();
    
    //clean up data to remove $$hashkey
    data = angular.copy(this.data);
    this.cleanupAngularObject(data);
    Question.insert(data);
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

const name = 'addtest';

export default  angular.module(name, [
    angularMeteor,
    uiRouter,
    ngMaterial
  ]
)
.component(name,  {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: AddTest
})
.config(config);

function config($stateProvider) {
'ngInject';
$stateProvider
	.state('addtest', {
		url: '/addtest',
		template: '<addtest></addtest>'
	});
}
