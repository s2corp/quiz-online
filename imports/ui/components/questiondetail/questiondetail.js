import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import './questiondetail.html';
import { Question } from '../../../api/question';

class QuestionDetail {
  constructor($stateParams, $scope, $reactive) {
      'ngInject';

      $reactive(this).attach($scope);
      //console.log($stateParams.questionId);
      this.subscribe("question");
      this.helpers({
        question() {
          return Question.find({
            _id: $stateParams.questionId
          });
        }
      });
    }

    // save() {
    //   Parties.update({
    //     _id: this.data.id
    //   }, {
    //     $set: {
    //       name: this.party.name,
    //       description: this.party.description
    //     }
    //   }, (error) => {
    //   if (error) {
    //     console.log('Oops, unable to update the party...');
    //   } else {
    //     console.log('Done!');
    //   }
    // });
    // }
}

const name = 'questiondetail';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: QuestionDetail
})
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('questionDetail', {
      url: '/manageQuestion/:questionId',
      template: '<questiondetail><questiondetail>',
    });
}
