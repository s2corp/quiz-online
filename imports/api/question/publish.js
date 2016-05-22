import { Meteor } from 'meteor/meteor';
import {Question} from './collection.js';
if(Meteor.isServer){
  Meteor.publish('question', function(){
    return Question.find({});
  });
}
