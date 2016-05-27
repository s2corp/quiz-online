import { Meteor } from 'meteor/meteor';
import {Examination} from './collection.js';
if(Meteor.isServer){
    Meteor.publish('examination', function(){
      return Examination.find({});//note
  })
}
