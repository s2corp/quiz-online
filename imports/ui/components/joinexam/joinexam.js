import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './joinexam.html';

import { UserExam } from '../../../api/lists/userexam';
import { Examination } from '../../../api/lists/examination'

class JoinExam{

  constructor(){
    this.data = {};
  }

  joinExam(){

    var user = {
      userId: Meteor.userId(),
      score: 0
    }

    if(this.myForm.$valid){
      this.data.userId = Meteor.userId();
      this.data.date = new Date();
      UserExam.insert(this.data);
      Examination.update( { '_id': this.data.examCode }, { $push: {'usersList': user} } );
    }
  }

}

const name = 'joinexam';

export default  angular.module(name, [
    angularMeteor,
    uiRouter,
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: JoinExam
})
.config(config);

function config($stateProvider) {
'ngInject';
$stateProvider
	.state('joinExam', {
		url: '/joinExam',
		template: '<joinexam></joinexam>'
	});
}
