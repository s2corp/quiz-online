import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { name as Maincomponent } from '../imports/ui/components/maincomponent/maincomponent';
Meteor._reload.onMigrate(function() {
  return [false];
});
