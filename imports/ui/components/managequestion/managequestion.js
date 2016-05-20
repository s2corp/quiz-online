import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './managequestion.html';
import { Question } from '../../../api/lists/question.js'

class Manager{
  constructor($scope, $reactive){
    'ngInject';

    $reactive(this).attach($scope);
    this.helpers({
      questions() {
        return Question.find({'userId': Meteor.userId()});
      }
    });
  }

  remove(questionId){
    Question.remove(questionId)
  }

  addQuestion(question){
    //thống kê mức độ câu hỏi
    var levelHard = 0;
    var levelNormal = 0;
    var levelEasy = 0;
    question.questionSet.forEach((elem) => {
      if(elem.level === 'Khó')
        levelHard ++;
        if(elem.level === 'Trung bình')
          levelNormal ++;
          if(elem.level === 'Dễ')
            levelEasy ++
    });

    Session.set('questionId', question._id);
    Session.set('levelHard', levelHard);
    Session.set('levelNormal', levelNormal);
    Session.set('levelEasy', levelEasy);
    Session.set('questionCount', question.questionSet.length);
    Session.set('selectedTab', 1);
  }
}

const name='managequestion';

export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Manager
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
  	.state('manageQuestion', {
  		url: '/manageQuestion',
  		template: '<managequestion></managequestion>'
  	});
}
