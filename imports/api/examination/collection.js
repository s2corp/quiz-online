import {Mongo} from 'meteor/mongo';
export const Examination =new Mongo.Collection("examination");
Examination.allow({
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
