import { Meteor } from 'meteor/meteor';
//import { Users } from '../imports/api/lists/user.js';
import { Question } from '../imports/api/lists/question.js';
import { Email } from 'meteor/email';
import { Session } from 'meteor/session';

process.env.MAIL_URL = 'smtp://sanghuynhnt95@gmail.com:123581321tuongmo@smtp.gmail.com:465/';

//thêm user
Meteor.methods({
  insertUser: function(user){
    Meteor.users.insert(user)
  }
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
