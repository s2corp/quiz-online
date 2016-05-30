import {Mongo} from 'meteor/mongo';

export const Responsive = new Mongo.Collection("responsive");

Responsive.allow({
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
