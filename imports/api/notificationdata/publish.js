import { Meteor } from 'meteor/meteor';
export const NotificationData = new Mongo.Collection('notification');
if(Meteor.isServer){
    Meteor.publish('notification', function(){
      return NotificationData.find({});//note
    });
  }
