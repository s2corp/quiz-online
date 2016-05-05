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
      questionSet: [{
        question: "",
        answerSet: []
      }]
    };
    //this.data.questionSet.question = [];
    this.index = 1;
    this.answer = 0;
    this.question = 0;
    this.compile = $compile;
    this.scope = $scope;
    this.inputList = [
      '<md-input-container class="md-block" flex-gt-sm><label>câu hỏi thứ 1</label><input ng-model="user.firstName"></md-input-container>',
    ];

    //this.addHtmlElement();

    // this.helpers({
    //   parties() {
    //     return this.inputListHtml;
    //   }
    // });
  }

  appendAnswer(event)
  {
    console.log(this.data.questionSet);
    this.answer ++;
    var anString =
    '<div id=answer'+ this.question + '_' + this.answer + '>' +
      '<md-input-container class="md-block" flex-gt-sm>' +
        '<label>câu trả lời ' + this.answer + '</label>' +
        '<input ng-model="addtest.data.questionSet[' + this.question + '].answerSet.answer[' + this.answer + ']">' +
      '</md-input-container>' +
      '<button id="#answer' + this.question + '_' + this.answer + '" ng-click="addtest.removeAnswer($event)">X</button>' +
    '</div>';
    this.inputList.push(anString);
    //alert('#answer' + obj.target.id)
    var myEl = angular.element( document.querySelector( event.target.id) );
    myEl.append(this.compile(anString)(this.scope));
  }

  removeAnswer(event)
  {
    var answerIndex = parseInt(event.target.id.charAt(9));
    var questionIndex = parseInt(event.target.id.charAt(7));
    this.data.questionSet[questionIndex].answerSet.splice(answerIndex, 1);
    console.log(this.data.questionSet);
    var id = event.target.id.substring(1);
    //document.getElementById(id).value = '';
    //alert(event.target.id);
    var myEl = angular.element( document.querySelector( event.target.id) );
    myEl.remove();
    //this.data.questionSet = {};
  }

  appendQuestion()
  {
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
                                          '<input ng-model="addtest.data.questionSet[' + this.question + '].answerSet.answer[' + this.answer +']">' +
                                    '</md-input-container>' +
                                    '<button id="#answer' + this.question + '_' + this.answer + '" ng-click="addtest.removeAnswer($event)">X</button>' +
                                  '</div>' +
                                '</div>' +
                                '<button id="#answer'+ this.question + '" class="md-primary md-hue-1" ng-click="addtest.appendAnswer($event)">Thêm câu trả lời</button>' +
                                '<button id="#question' + this.question + '" class="md-primary md-hue-1" ng-click="addtest.removeQuestion($event)">Xóa câu hỏi</button>' +
                          '</md-content>';
    //this.inputList.push(anString);
    var myEl = angular.element( document.querySelector( '#questionSet' ) );
    myEl.append(this.compile(quesString)(this.scope));
  }

  removeQuestion(event)
  {
    console.log(event.target.id);
    var myEl = angular.element( document.querySelector( event.target.id) );
    myEl.remove();
  }

  addTest()
  {
    Question.insert(this.data);
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
