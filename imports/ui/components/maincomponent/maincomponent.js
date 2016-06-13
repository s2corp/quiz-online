import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import { name as Home } from '../home/home';
import { name as Register } from '../register/register';
import { name as Navigation } from '../navigation/navigation';
import { name as Authenticated } from '../authenticated/authenticated';
import { name as StartQuiz } from '../startquiz/startquiz';
import { name as Notification } from '../notification/notification';
import { name as NotificateButton } from '../notificateButton/notificateButton';
import { name as SendMailButton } from '../sendMailButton/sendMailButton';
import {name as UserProfile} from '../userProfile/userProfile';
import { name as joinExam} from '../joinExam/joinExam';
import { name as waitExam} from '../waitExam/waitExam';
import { name as startedExam} from '../startedExam/startedExam';
import { name as scoredExam} from '../scoredExam/scoredExam';
import { name as PageNotFound } from '../pageNotFound/pageNotFound';
import { name as Menu } from '../menu/menu';
import { name as Auth } from '../auth/auth';
import {name as profileExam} from '../profileExam/profileExam';
import {name as detailExam} from '../detailExam/detailExam';
import {name as tutorial} from '../tutorial/tutorial';
import {name as statistics} from '../statistics/statistics';
import {name as detailStatistics} from '../detailStatistics/detailStatistics';

import './maincomponent.html';

class Main{
  constructor(){
     google.charts.load('current', {'packages':['corechart']});//onload pie

  }
}

const name = 'maincomponent';

export default  angular.module(name, [
    angularMeteor,
    Home,
    Register,
    Navigation,
    uiRouter,
    Authenticated,
    NotificateButton,
    SendMailButton,
    StartQuiz,
    UserProfile,
    Notification,
    joinExam,
    waitExam,
    startedExam,
    scoredExam,
    Auth,
    profileExam,
    detailExam,
    tutorial,
    PageNotFound,
    Menu,
    statistics,
    detailStatistics
    ///ngMaterial
  ]
)
.component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Main
})
.config(config)
.run(run);

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

function run($rootScope, $state) {
  'ngInject';

  $rootScope.$on('$stateChangeError',
    (event, toState, toParams, fromState, fromParams, error) => {
      if (error === 'AUTH_REQUIRED') {
        alert('bạn cần đăng nhập trước khi thực hiện thao tác này');
        $state.go('login');
      }
      if (error === 'JOB_REQUIRED')
        alert('bạn cần có tài khoản giáo viên để có thể thực hiện thao tác này')
      if (error === 'VERTIFICATE_REQUIRED')
        alert('một mail chứng thực đã được gửi đến email của bạn, đề nghị xác thực email trước khi thực hiện thao tác này');
      if(error === 123)
        $state.go('home');
    }
  );
}
