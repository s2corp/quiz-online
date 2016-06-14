import { Meteor } from 'meteor/meteor';
import {Questionstatistics} from './collection.js';
if(Meteor.isServer){
    Meteor.publish('questionstatistics', function(){
      return Questionstatistics.find({});//note
  })
}
