import { Meteor } from 'meteor/meteor';
import {Responsive} from './collection.js';
if(Meteor.isServer){
    Meteor.publish('responsive', function(){
      return Responsive.find({});//note
  })
}
