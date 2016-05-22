import { Meteor } from 'meteor/meteor';
import {Examination} from './collection.js';
if(Meteor.isServer){
    Meteor.publish('examination', function(id){
      return Examination.find( { _id: id } );//note
  })
}
