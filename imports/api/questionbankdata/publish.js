import { Meteor } from 'meteor/meteor';
import {QuestionBankData} from './collection.js';
if(Meteor.isServer){
    Meteor.publish('questionbankdata', function(){
      return QuestionBankData.find({});//note
    });
  }
