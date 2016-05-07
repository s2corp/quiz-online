import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import { name as Home } from '../home/home';
import { name as Register } from '../register/register';
import { name as RegisterStudent } from '../register_student/registerStudent';
import { name as RegisterTeacher } from '../register_teacher/registerTeacher';
import { name as Navigation } from '../navigation/navigation';
import { name as Authenticated } from '../authenticated/authenticated';
import { name as AddTest } from '../addtest/addtest';
import { name as ManageQuestion } from '../managequestion/managequestion';
import { name as QuestionDetail } from '../questiondetail/questiondetail';

import './maincomponent.html';

class Main{}

const name = 'maincomponent';

export default  angular.module(name, [
    angularMeteor,
    Home,
    Register,
    Navigation,
    uiRouter,
    RegisterTeacher,
    RegisterStudent,
    Authenticated,
    AddTest,
    ManageQuestion,
    QuestionDetail
    ///ngMaterial
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Main
})
.config(config)
  // .run(run);

function config($locationProvider, $urlRouterProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/home');
}
