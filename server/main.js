import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Session } from 'meteor/session';
import { Promise } from 'meteor/promise';

import { Images } from '../imports/api/image'; 
import { NotificationData } from '../imports/api/notificationdata';
import { Examination } from '../imports/api/examination';
import { Responsive } from '../imports/api/responsive';
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

// //save facebook user avatar
// var getFbPicture = function(accessToken) { // make async call to grab the picture from facebook
//     var result;
//     result = Meteor.http.get("https://graph.facebook.com/me", {
//       params: {
//         access_token: accessToken,
//         fields: 'picture'
//       }
//     });
//     if(result.error) {
//       throw result.error;
//     }
//     console.log(result.data.picture.data.url);
//     return result.data.picture.data.url; // return the picture's url
//   };

// during new account creation get user picture from Facebook and save it on user object
Accounts.onCreateUser(function(options, user) {

  user.profile = {};
  // Assigns first and last names to the newly created user object
  user.profile.name = options.profile.name;
  user.profile.job = options.profile.job;
  // Returns the user object

  if(user.services.facebook)
    if(options.profile) {
      options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
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

Meteor.publish("user", function() {
  return Meteor.users.find({ });
});

    //thong tin user cua ki thi
Meteor.methods({
    finduser:function(exam){
      var data = [];
      for (var i = 0; i < exam.usersList.length; i++) {
        var user = Meteor.users.findOne({_id:exam.usersList[i].userId});
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

Meteor.methods({
  timeRun:function(time){
     time--;
     return time;
  }
});


//kiem tra cau tra loi va cap nhap lai diem so
Meteor.methods({
  checkanswer:function(id,user,question_id,question,answer,index){
    var exam = Examination.findOne({_id:id});
    var totaluser = exam.usersList.length;
    var tam = Question.findOne({$and:[{"_id":question_id}
      ,{"questionSet": { $elemMatch: { "question":question,"correctAnswer":answer}}}]});
    if(tam !== null)
    {
      var count = tam.questionSet[index].countCorrect + 1;
      var num = count / totaluser;
      var val = num.toFixed(3);
      Examination.update({_id:id,"usersList.userId":user}, {$inc:{
          "usersList.$.score":tam.questionSet[index].score
      }});
      Question.update({_id:question_id,"questionSet.question":question}, {$inc:{
        "questionSet.$.countCorrect":1},$set:{"questionSet.$.rate":val
    }});
    }

    var score = 0;
    var val = Examination.findOne({$and:[{"_id":id},{"usersList.userId":user}]});
    for (var i = 0; i < val.usersList.length; i++) {
      if(val.usersList[i].userId === user)
      {
          score = val.usersList[i].score;
      }
    }
      return score;
  }
});

Meteor.methods({
  updateExam:function(id,user,scored){
  Examination.update({_id:id,"usersList.userId":user}, {$set:{
        "usersList.$.score":scored
      }});
  }
});

Meteor.methods({
  updateScored:function(id){
      return Examination.findOne({"_id":id});
  }
});

//in ra diem va thong tin cua ki thi
Meteor.methods({
  scoredUserInf:function(exam){
    var contain = [];
    var ob = {};
    for (var i = 0; i < exam.usersList.length; i++) {
      var user = Meteor.users.findOne({_id:exam.usersList[i].userId});
    //  console.log(user);
      ob.name = user.profile.name;
      if(user.services.facebook.email)
      {
          ob.email = user.services.facebook.email;
      }
      else if (user.services.google.email) {
          ob.email = user.services.google.email;
      }
      else {
          ob.email = user.emails[0].address;
      }
      ob.scored = exam.usersList[i].score;
      contain.push(ob);
          ob ={};
    }
    return contain;
  }
});

//thong ke chi tiet ki thi
  Meteor.methods({
    detailstatis:function(id){
      var contain=[];
      var ob={};
      var exam = Examination.findOne({_id:id});
      var totaluser = exam.usersList.length;
      var data= Question.findOne({_id:exam.questionSetId});
      var total = data.questionSet.length;
      for (var i = 0; i < total; i++) {
        ob.question = data.questionSet[i].question;
        ob.countCorrect = data.questionSet[i].countCorrect ;
        ob.rate = data.questionSet[i].rate;
        contain.push(ob);
        ob ={};
      }
      return contain;
    }
  });

  //thong ke ki thi dang bieu do
  Meteor.methods({
      statis:function(id){
        var ob = {};
        var easy = 0;
        var normal = 0;
        var hardly =0;
        var exam = Examination.findOne({_id:id});
        var totaluser = exam.usersList.length;
        var data= Question.findOne({_id:exam.questionSetId});
        var totalquestion = data.questionSet.length;
        for (var i = 0; i < totalquestion; i++) {
          var check = data.questionSet[i].rate;
          if(check >= 0.6)
            easy = easy + check;
            else if (check >=0.3 && check < 0.6) {
              normal = normal + check;
            }
            else {
              hardly = hardly + check;
            }
        }
        ob.easy = Math.round(  easy * 100);
        ob.normal = Math.round(  normal * 100);
        ob.hardly = Math.round(  hardly * 100);
        return ob;
    }
  });
