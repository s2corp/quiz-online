import {Mongo} from 'meteor/mongo';
export const NotificationData = new Mongo.Collection('notificationdata');
NotificationData.allow({
  insert: function(){
    return true;
  },
  update: function(userId){
    return userId;
  },
  remove: function(){
    return true;
  }
});
