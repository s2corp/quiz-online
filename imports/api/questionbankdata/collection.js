import {Mongo} from 'meteor/mongo';
export const QuestionBankData = new Mongo.Collection('questionbank');
QuestionBankData.allow({
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
