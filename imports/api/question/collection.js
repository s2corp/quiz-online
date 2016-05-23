import {Mongo} from 'meteor/mongo';
export const Question =new Mongo.Collection("question");
Question.allow({
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
