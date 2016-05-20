import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Session } from 'meteor/session';

import { NotificationData } from '../imports/api/lists/notification.js';
import { Examination } from '../imports/api/lists/examination.js';
import { Question } from '../imports/api/lists/question.js';
import { QuestionBankData } from '../imports/api/lists/questionbankdata.js';
import {UserExam} from '../imports/api/lists/userexam.js';

process.env.MAIL_URL = 'smtp://sanghuynhnt95@gmail.com:123581321tuongmo@smtp.gmail.com:465/';

//sang huynh
//nguyen xuan vinh
//thêm user

function Sang(){
}

function vinh(){

}
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
