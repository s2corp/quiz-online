import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Session } from 'meteor/session';
import {Promise} from 'meteor/promise';
import { NotificationData } from '../imports/api/notificationdata';
import { Examination } from '../imports/api/examination';
import { Question } from '../imports/api/question';
import { QuestionBankData } from '../imports/api/questionbankdata';
process.env.MAIL_URL = 'smtp://sanghuynhnt95@gmail.com:123581321tuongmo@smtp.gmail.com:465/';

Meteor.methods({
  insertUser: function(user){
    Meteor.users.insert(user)
  }
});

//save facebook user avatar
var getFbPicture = function(accessToken) { // make async call to grab the picture from facebook
    var result;
    result = Meteor.http.get("https://graph.facebook.com/me", {
      params: {
        access_token: accessToken,
        fields: 'picture'
      }
    });
    if(result.error) {
      throw result.error;
    }
    return result.data.picture.data.url; // return the picture's url
  };

// during new account creation get user picture from Facebook and save it on user object
Accounts.onCreateUser(function(options, user) {
  if(options.profile) {
    options.profile.picture = getFbPicture(user.services.facebook.accessToken);
    user.profile = options.profile; // We still want the default 'profile' behavior.
  }
  return user;
});

//kiểm tra mail trùng lặp
Meteor.methods({
  findUser: function(inMail){
    //console.log(Meteor.users.find({mail: inMail}).count());
    var result = Meteor.users.find({mail: inMail}).count();
    return result;
  }
});

//gửi mail
Meteor.methods({
      sendEmail: function (mailAdress, encryptedString) {

        //chuyen huong den template
        SSR.compileTemplate('emailText', Assets.getText("vertificateMail.html"));

        //chuyen html
        var html = SSR.render("emailText", {text:encryptedString});

        //nội dung mail
        var email = {
          to: mailAdress,
          from: 'sanghuynhnt95@gmail.com',
          subject: "test email",
          html: html
        };

        //gửi mail
        Email.send(email);
      }
  });

  Meteor.publish("userStatus", function() {
    //console.log(Notification.find( { 'userId': Meteor.userId() } ).count());
    return Meteor.users.find({ "status.online": true });
  });



  Meteor.methods({
    finduser:function(userList){
      var data = [];
      for (var i = 0; i < userList.length; i++) {

        var user = Meteor.users.findOne({_id:userList[i].userId});

        data.push(user)
      }
      console.log(data);

      return data;
    }
  });

  //countTime
  Meteor.methods({
    timeRunOut:function(time){
       time--;
       return time;
    }
  });


  //kiem tra cau tra loi
  Meteor.methods({
    scoredUser:function(id,user){
      var val = Examination.findOne({$and:[{"_id":id},{"usersList.userId":user}]});
      for (var i = 0; i < val.usersList.length; i++) {
        if(val.usersList[i].userId === user)
        {
          console.log("vi tri " +i);
          console.log(val.usersList[i].scored);
            return val.usersList[i].scored;
        }


      }
      //console.log(val);


    }
  });

  Meteor.methods({
    checkanswer:function(id,user,question_id,question,answer,index){
      var tam = Question.findOne({$and:[{"_id":question_id}
        ,{"questionSet": { $elemMatch: { "question":question,"correctAnswerSet":answer}}}]});
      if(tam !== null)
      {
        Examination.update({_id:id,"usersList.userId":user}, {$inc:{
            "usersList.$.scored":tam.questionSet[index].scored
        }});
      }


      var score = 0;
      var val = Examination.findOne({$and:[{"_id":id},{"usersList.userId":user}]});
      for (var i = 0; i < val.usersList.length; i++) {
        if(val.usersList[i].userId === user)
        {
          console.log("vi tri " +i);
          console.log(val.usersList[i].scored);
            score = val.usersList[i].scored;
        }
      }
        return score;
}
  });

    Meteor.methods({
      updateExam:function(id,user,scored){
        Examination.update({_id:id,"usersList.userId":user}, {$set:{
            "usersList.$.scored":scored
        }});
      }
    });
