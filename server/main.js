import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Session } from 'meteor/session';

import { NotificationData } from '../imports/api/notificationdata';
import { Examination } from '../imports/api/examination';
import { Question } from '../imports/api/question';
import { QuestionBankData } from '../imports/api/questionbankdata';
process.env.MAIL_URL = 'smtp://sanghuynhnt95@gmail.com:123581321tuongmo@smtp.gmail.com:465/';

var VertificateCode = '';

Meteor.methods({
  insertUser: function(user){
    Meteor.users.insert(user)
  }
});

Meteor.methods({
  updateUser: function(user){
    if(user.code === VertificateCode){
      var userFind = Meteor.users.findOne({'_id': Meteor.userId()});
      if(userFind.profile.job !== '')
        Meteor.users.update({'_id': Meteor.userId(), 'emails.address': user.email}, {$set: {'emails.$.verified': true}});
      else
        Meteor.users.update({'_id': Meteor.userId()}, {$set: {'profile.job': 'teacher'}});
    }else
      if(user.code === 'student')
        Meteor.users.update({'_id': Meteor.userId()}, {$set: {'profile.job': 'student'}});
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

  user.profile = {};
  // Assigns first and last names to the newly created user object
  user.profile.name = options.profile.name;
  user.profile.job = options.profile.job;
  // Returns the user object

  if(user.services.facebook)
    if(options.profile) {
      options.profile.picture = getFbPicture(user.services.facebook.accessToken);
      options.profile.job = '';
      user.profile = options.profile; // We still want the default 'profile' behavior.
    }
  return user;
});

//kiểm tra mail trùng lặp
Meteor.methods({
  findUser: function(inMail){
    var result = Meteor.users.find({mail: inMail}).count();
    return result;
  }
});

//gửi mail
Meteor.methods({
      sendEmail: function (mailAddress) {
        VertificateCode = (Math.floor(Math.random()*99999) + 10000).toString();

        //khởi tạo đối tượng mã hóa
        var Cryptr = require('cryptr'),
        cryptr = new Cryptr('ntuquiz123');

        //mã hóa mật khẩu
        var content = '{"code": ' + '"' + VertificateCode + '", ' + '"email": ' + '"' + mailAddress + '"}';

        //nội dung sau khi mã hóa
        var encryptedString = cryptr.encrypt(content);

        //chuyen huong den template
        SSR.compileTemplate('emailText', Assets.getText("vertificateMail.html"));

        //chuyen html
        var html = SSR.render("emailText", {text:encryptedString});

        //nội dung mail
        var email = {
          to: mailAddress,
          from: 'sanghuynhnt95@gmail.com',
          subject: "test email",
          html: html
        };

        //gửi mail
        Email.send(email);
      }
  });

  Meteor.publish("userStatus", function() {
    return Meteor.users.find({ "status.online": true });
  });


  Meteor.methods({
    updateExam:function(id,user,scored){
      Examination.update({_id:id,"usersList.userId":user}, {$set:{
          "usersList.$.scored":scored
      }});
    }
  });

  Meteor.methods({
    finduser:function(userList){
      var data = [];
      for (var i = 0; i < userList.length; i++) {

        var user = Meteor.users.findOne({_id:userList[i].userId});

        data.push(user)
      }

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
    checkanswer:function(question_id,question,answer,index){
      var tam = Question.find({$and:[{"_id":question_id}
        ,{"questionSet": { $elemMatch: { "question":question,"correctAnswerSet":answer}}}]}).count();
      if(tam > 0)
      {
        console.log(tam)
        return tam;
      }
      else {
        console.log("-1");
        return -1;
      }
    }
  });
