import {Mongo} from 'meteor/mongo';

export const Questionstatistics = new Mongo.Collection("questionstatistics");

Questionstatistics.allow({
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
