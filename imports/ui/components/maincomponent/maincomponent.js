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
import { name as QuestionDetail } from '../questiondetail/questiondetail';
import { name as StartQuiz } from '../startquiz/startquiz';
import { name as Notification } from '../notification/notification';
import { name as NotificateButton} from '../notificateButton/notificateButton';
import { name as joinExam} from '../joinExam/joinExam';
import { name as waitExam} from '../waitExam/waitExam';
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
    NotificateButton,
    QuestionDetail,
    StartQuiz,
    Notification,
    joinExam,
    waitExam
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

function config($locationProvider, $urlRouterProvider, $mdIconProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/home');
  const iconPath =  '/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/';

  $mdIconProvider
    .iconSet('social',
      iconPath + 'svg-sprite-social.svg')
    .iconSet('action',
      iconPath + 'svg-sprite-action.svg')
    .iconSet('communication',
      iconPath + 'svg-sprite-communication.svg')
    .iconSet('content',
      iconPath + 'svg-sprite-content.svg')
    .iconSet('toggle',
      iconPath + 'svg-sprite-toggle.svg')
    .iconSet('navigation',
      iconPath + 'svg-sprite-navigation.svg')
    .iconSet('image',
      iconPath + 'svg-sprite-image.svg');
}
