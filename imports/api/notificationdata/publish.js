import { Meteor } from 'meteor/meteor'

import { NotificationData } from './collection.js';

if(Meteor.isServer){
    Meteor.publish('notification', function(){
      return NotificationData.find({});//note
    });
  }
