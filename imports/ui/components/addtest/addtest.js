import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import { Question } from '../../../api/question';
import { Questionstatistics } from '../../../api/questionstatistics';
import { Medias } from '../../../api/media';
import './addtest.html';

class AddTest {
  constructor($scope, $reactive, $compile, $sce,$location) {
    'ngInject';

    $reactive(this).attach($scope);
    this.subscribe("question");
    this.subscribe("images");
    this.location = $location;
    //mã câu hỏi sinh tự động
    this.code = (Math.floor(Math.random()*99999) + 10000).toString();

    //khởi tạo nội dung câu hỏi
    this.data = {
      _id: this.code,
      questionSet: [
        {
          question: '',
          image: '',
          audio: '',
          answerSet: [],
          correctAnswer: '',
          score: 1,
          countCorrect: 0,
          rate: 0
        }
      ],

    };

    //số lượng câu trả lời hiện tại
    this.answer = 0;

    //sử dụng để hiển thị confirm log
    this.confirm = false;

    //dùng để ẩn chức năng câu hỏi
    this.disable = 0;

    //số lượng câu hỏi hiện tại
    this.question = 0;

    this.compile = $compile;

    this.scope = $scope;

    this.showReview = 'hidden';

    //xóa dữ liệu trong questionId
    delete Session.keys['questionId'];
  }

  //thêm đề
  addTest()
  {
    this.mediaElements = Array.prototype.slice.call(document.getElementsByClassName("mediaInput"));

    for(i = 0; i < this.data.questionSet.length; i++){
      if(this.data.questionSet[i] === null){
        this.data.questionSet.splice(i, 1);
        this.mediaElements.splice(i, 1);
        i--;
      }
      else
        for(j = 0; j < this.data.questionSet[i].answerSet.length; j++){
          if(this.data.questionSet[i].answerSet[j] === ''){
            this.data.questionSet[i].answerSet.splice(j, 1);
            j--;
          }
        }
    }
    this.reviewMedia();
    this.showReview = "show";
    this.selectedTab = 2;
    this.numberQuestion();
  }

  //thêm đáp án
  appendAnswer(event)
  {
    this.answer ++;
    //var answer = this.data.questionSet[this.question].answerSet.length;
    var anString =
    '<div id=answer'+ this.question + '_' + this.answer + ' layout = "row" layout-align="left center">' +
      '<md-input-container class="md-block" flex-gt-sm>' +
        '<label>câu trả lời ' + this.answer + '</label>' +
        '<textarea ng-model="addtest.data.questionSet[' + this.question + '].answerSet[' + this.answer + ']" md-maxlength="500" rows="5" md-select-on-focus></textarea>' +
      '</md-input-container>' +
      '<input type="radio" id="radio_' + this.question + '_' + this.answer + '" class="css-checkbox" name="gender" ng-click="addtest.insertCorrectAnswer($event)"><label title="Đáp án đúng" class="css-label" for="radio_' + this.question + '_' + this.answer + '"></label>' +
      // '<input type="radio" name="gender" ng-click="addtest.insertCorrectAnswer(' + this.question + ', addtest.data.questionSet[' + this.question + '].answerSet[' + this.answer + '])"> Đáp án đúng <br>' +
      '<button id="#answer' + this.question + '_' + this.answer + '" class="deleteAns" ng-click="addtest.removeAnswer($event)">X</button>' +
    '</div>';
    var myEl = angular.element( document.querySelector( event.target.id) );
    myEl.append(this.compile(anString)(this.scope));
  }

  //thêm câu hỏi
  appendQuestion()
  {
    var addAnswerList = document.getElementsByClassName('addAnswer');
    var i = addAnswerList.length - 1;
    addAnswerList[ i ].disabled = true;

    if( this.data.questionSet.length === this.questionCount && !this.confirm)
      if(confirm('bạn đã nhập đủ số lượng câu hỏi khai báo là ' + this.questionCount + ' tiếp tục nhập?')){
        this.data.questionSet [ questionSet.length - 1 ] = null;
        this.confirm = true;
      }

    if( this.data.questionSet.length >= this.questionCount ) {
      this.questionCount += 5;
      this.scoreDivide = this.score / this.questionCount;
      for(i = 0; i < this.data.questionSet.length; i++)
        this.data.questionSet[i].score = this.scoreDivide;
    }

    var question = {
        question: '',
        image: '',
        audio: '',
        answerSet: [],
        correctAnswer: '',
        score: this.scoreDivide,
        countCorrect: 0,
        rate: 0
    }

    this.data.questionSet.push(question);
    this.question ++;
    this.answer = 0;
    var quesString = '<br><md-content id="question' + this.question + '" class="md-padding" style="background-color: rgb(209, 223, 227)">' +
                                '<md-input-container class="md-block" flex-gt-sm>' +
                                      '<label>Câu hỏi thứ ' + this.question + '</label>' +
                                      '<textarea ng-model="addtest.data.questionSet[' + this.question + '].question" md-maxlength="500" rows="5" md-select-on-focus></textarea>' +
                                '</md-input-container>' +
                                '<div layout="column">' +
                                    '<img id="photo_' + this.question + '" style="width:80%" class="media" src="">' +
                                    '<audio id="audio_' + this.question + '" controls class="media" style="visibility: hidden;" src=""></audio>' +
                                    '<p id="mediaError_' + this.question + '" class="error" role="alert" style="color: red; display: none;">' +
                                        'file media phải có kích thước nhỏ hơn 10 Megabyte' +
                                    '</p>' +
                                '</div>' +
                                '<script>' +
                                  // Upload hình ảnh
                                  'document.getElementById("media_question_' + this.question + '").onchange = function () {' +
                                    'var reader = new FileReader();' +
                                    'if(this.files[0].size > 10485760) {' +
                                      'document.getElementById("mediaError_' + this.question + '").style.display = "inline";' +
                                      'document.getElementById("addQues").disabled = true;' +
                                      'document.getElementById("finish").disabled = true;' +
                                    '}' +
                                    'else {' +
                                      'document.getElementById("mediaError_' + this.question + '").style.display = "none";' +
                                      'document.getElementById("addQues").disabled = false;' +
                                      'document.getElementById("finish").disabled = false;' +
                                      'if(this.files[0].type.substring(0, 5) === "image") {' +
                                        'document.getElementById("audio_0").src = "";' +
                                        'reader.onload = function (e) {' +
                                          // get loaded data and render thumbnail.
                                          'document.getElementById("photo_' + this.question + '").src = e.target.result;' +
                                        '};' +

                                          // read the image file as a data URL.
                                        'if(this.files[0])' +
                                          'reader.readAsDataURL(this.files[0]);' +
                                        'document.getElementById("audio_' + this.question + '").style.visibility = "hidden";' +
                                      '}' +
                                      'else {' +
                                        'document.getElementById("photo_0").src = "";' +
                                        'var sound = document.getElementById("audio_' + this.question + '");' +
                                        'reader.onload = (function(audio) {return function(e) {audio.src = e.target.result;};})(sound);' +

                                        // read the audio file as a data URL.
                                        'if(this.files[0])' +
                                          'reader.readAsDataURL(this.files[0]);' +
                                        'document.getElementById("audio_' + this.question + '").style.visibility = "visible";' +
                                      '}' +
                                    '}' +
                                  '};' +
                                '</script>' +

                                '<br>' +
                                '<form>' +
                                  '<div id="answer' + this.question + '" layout-gt-sm="column">' +
                                    '<div id=answer'+ this.question + '_' + this.answer + ' layout = "row" layout-align="left center">' +
                                      '<md-input-container class="md-block" flex-gt-sm>' +
                                            '<label>Câu trả lời 1</label>' +
                                            '<textarea ng-model="addtest.data.questionSet[' + this.question + '].answerSet[0]" md-maxlength="500" rows="5" md-select-on-focus></textarea>' +
                                      '</md-input-container>' +
                                      '<input type="radio" id="radio_' + this.question + '_' + this.answer + '" class="css-checkbox" name="gender" ng-click="addtest.insertCorrectAnswer($event)"><label class="css-label" for="radio_' + this.question + '_' + this.answer + '"></label>' +
                                      '<button id="#answer' + this.question + '_' + this.answer + '" class="deleteAns" ng-click="addtest.removeAnswer($event)">X</button>' +
                                    '</div>' +
                                  '</div>' +
                                '</form>' +
                                '<md-input-container class="md-block" flex-gt-sm>' +
                                  '<label>Điểm số</label>' +
                                  '<input ng-model="addtest.data.questionSet[' + this.question + '].score" style="width: 120px;" type="number" step="0.25">' +
                                '</md-input-container>' +
                                '<div layout="row" layout-align="left center" style="width: 40%;">' +
                                  '<button id="#answer' + this.question + '" class="addAnswer" ng-click="addtest.appendAnswer($event)">Thêm lựa chọn</button>' +
                                  '<span flex style="min-width: 3px;"></span>' +

                                  '<label class="file">' +
                                    '<input id="media_question_' + this.question + '" class="mediaInput" type="file" md-select-on-focus accept="image/*, audio/*">' +
                                    '<span>Thêm Media</span>' +
                                  '</label>' +
                                  '<span flex style="min-width: 3px;"></span>' +

                                  '<button id="#question' + this.question + '" class="deleteQues" ng-click="addtest.removeQuestion($event)">Xóa câu hỏi</button>' +
                                '</div>' +
                          '</md-content>';
    var myEl = angular.element( document.querySelector( '#questionSet' ) );
    myEl.append(this.compile(quesString)(this.scope));
    this.disable ++;
  }

  //gán điểm số mặt định
  setDefaultScore(){
    if(this.startForm.$valid) {
      this.scoreDivide = this.score / this.questionCount;
      this.data.questionSet[0].score = this.scoreDivide;
      this.selectedTab ++;
    }
  }

  //lưu bộ câu hỏi vào cơ sở dữ liẹu
  async buildTest()
  {
    var quesStatis = {
      _id: this.data._id,
      userId: Meteor.userId(),
      title: this.data.title,
      ExamSet: [],
      date:new Date()
    };

    Questionstatistics.insert(quesStatis);


    //thêm id của user đang đăng nhập
    if(Meteor.userId() != null)
      this.data.userId = Meteor.userId();

    //thêm ngày
    this.data.date = new Date();

    this.data.originId = this.data._id;

    //clean up data to remove $$hashkey
    var data = angular.copy(this.data);
    this.cleanupAngularObject(data);

    //thêm hình ảnh và cập nhật câu hỏi vào cơ sỏa dữ liệu
    var parent = this
    var index = 0;

    for(i = 0; i < this.mediaElements.length; i ++) {
       var file = this.mediaElements[i].files[0];

       if(file) {
          if(file.type.substring(0, 5) === 'image') {
            var fileObj = await this.insertMedia(file);
            data.questionSet[i].image ='http://'+this.location.host()+ '/images/' + fileObj.collectionName + '-' + fileObj._id + '-' + fileObj.original.name ;
          } else {
            var fileObj = await this.insertMedia(file)
              data.questionSet[i].audio ='http://'+this.location.host()+ '/images/' + fileObj.collectionName + '-' + fileObj._id + '-' + fileObj.original.name ;
            }

      }

    }

    Question.insert(data);
    Session.set('questionId', data._id);
    Session.set('questionCount', data.questionSet.length);
    Session.set('selectedTab', '2');
    this.data = {};
  }

  //đổi tab
  changeTab() {
    //this.checkValidAnswer();
    if(this.myForm.$valid) {
      this.showReview = 'visible';
          this.selectedTab ++;
    }
  }

  //kiểm tra việc nhập câu hỏi
  checkValidAnswer(){
    for(i = 0; i < this.data.questionSet.length; i++){
      if(this.data.questionSet[i] !== null)
        if(this.data.questionSet[i].correctAnswer === '' || this.data.questionSet[i].answerSet.length < 2)
        {
          if(this.data.questionSet[i].answerSet.length < 2)
            document.getElementById('answerError').style.display = 'inline';
          if(this.data.questionSet[i].correctAnswer === '')
            document.getElementById('correctError').style.display = 'inline';
          return false;
        }
    }
    return true;
  }


  //clean up data
  cleanupAngularObject(value)
  {
    if (value instanceof Array) {
        for (var i = 0; i < value.length; i++) {
              this.cleanupAngularObject(value[i]);
         }
    }
    else if (value instanceof Object) {
         for (property in value) {
             if (/^\$+/.test(property)) {
                 delete value[property];
             }
             else {
                 this.cleanupAngularObject(value[property]);
             }
         }
     }
 }

 insertMedia (file) {
   console.log('file content', file);
  return new Promise(function (resolve, reject) {
    Medias.insert(file, function (err, fileObj) {
      if(err) {
          reject(err);
      } else {
          resolve(fileObj);
        }
    })
  });
}

numberQuestion() {

  for(i = 0; i < this.data.questionSet.length; i++) {
    this.data.questionSet[i].question = 'Câu ' + (i + 1) + ': ' + this.data.questionSet[i].question;
    var c = 'A';
    for(j = 0; j < this.data.questionSet[i].answerSet.length; j ++) {
      if(this.data.questionSet[i].answerSet[j] === this.data.questionSet[i].correctAnswer) {
        this.data.questionSet[i].answerSet[j] = c + '. ' + this.data.questionSet[i].answerSet[j];
        this.data.questionSet[i].correctAnswer = c + '. ' + this.data.questionSet[i].correctAnswer;
      } else {
        this.data.questionSet[i].answerSet[j] = c + '. ' + this.data.questionSet[i].answerSet[j];
      }
      c = String.fromCharCode(c.charCodeAt(0) + 1)
    }
  }

}

 resetReview (){
   this.showReview = "hidden";
 }

 //hiện và ẩn nội dung ứng với một câu hỏi trong tab xem lại
 showhideQuestion(id){
  if(document.getElementById(id).style.display === 'none')
    document.getElementById(id).style.display = 'inline';
  else
    document.getElementById(id).style.display = 'none';
 }

 showMedia() {
   if(this.media === 'hình ảnh') {
     document.getElementById('imageTab_0').style.display = 'inline';
     document.getElementById('audioTab_').style.display = 'none';
   }
   else {
     document.getElementById('imageTab').style.display = 'none';
     document.getElementById('audioTab').style.display = 'inline';
   }

 }

 //chặn việc chuyển tab
 foreChange()
 {
   var check = this.checkValidAnswer();
   if(!this.myForm.$valid || !check)
    this.selectedTab = 0;
 }

 hideAudio(event){
   var length = event.target.id.length
   var index = parseInt(event.target.id.charAt(length - 1));
   document.getElementById('audioTab_0').reset();
   //document.getElementById('audio_' + index.toString()).src = '';
 }

 hideImage(event){
   var length = event.target.id.length
   var index = parseInt(event.target.id.charAt(length - 1));
   document.getElementById('imageTab_0').reset();
   //document.getElementById('photo_' + index.toString()).src = '';
 }

 //thêm đáp án chính xác
 insertCorrectAnswer(event){
   var answerIndex = parseInt(event.target.id.charAt(8));
   var questionIndex = parseInt(event.target.id.charAt(6));
   //this.data.correctAnswer = answer
   this.data.questionSet[questionIndex].correctAnswer = this.data.questionSet[questionIndex].answerSet[answerIndex];
 }

  //xóa đáp án
  removeAnswer(event)
  {
    var answerIndex = parseInt(event.target.id.charAt(9));
    var questionIndex = parseInt(event.target.id.charAt(7));
    var myEl = angular.element( document.querySelector( event.target.id) );

    myEl.remove();
    this.data.questionSet[questionIndex].answerSet[answerIndex] = '';
  }

  //xem lại âm thanh ứng với mỗi câu hỏi
  reviewMedia(){

    var mediaElements = document.getElementsByClassName("media" );
    var arrayElements = [];

    for(i = 0; i < mediaElements.length; i++) {
      //if(mediaElements[i].src !== 'http://localhost:3000/') {
        arrayElements.push(mediaElements[i]);
      //}
    }

    var imageArray = [];
    for(i = 0; i < arrayElements.length; i++) {
      if(arrayElements[i].tagName === 'IMG')
        imageArray.push(arrayElements[i]);
    }

    var audioArray = [];
    for(i = 0; i < arrayElements.length; i++) {
      if(arrayElements[i].tagName === 'AUDIO')
        audioArray.push(arrayElements[i]);
    }

    for(i = 0; i < imageArray.length; i++) {
      console.log(imageArray[i].src.substring(0, 50));
      if(imageArray[i].src !== 'http://quiz.s2corp.vn/default') {
          document.getElementById("reviewImage_" + i).src = imageArray[i].src;
      }
    }

    for(i = 0; i < audioArray.length; i++) {
      console.log(audioArray[i].src.substring(0, 50));
      if(audioArray[i].src !== 'http://quiz.s2corp.vn/default') {
          document.getElementById("reviewAudio_" + i).src = audioArray[i].src;
      }
    }

  }



  //xóa câu hỏi
  removeQuestion(event)
  {
    var addAnswerList = document.getElementsByClassName('addAnswer');
    var i = addAnswerList.length - 2;
    addAnswerList[ i ].disabled = false;

    var questionIndex = parseInt(event.target.id.charAt(9));
    var myEl = angular.element( document.querySelector( event.target.id) );

    myEl.remove();
    this.data.questionSet[questionIndex] = null;
    this.disable --;
    //this.question --;
  }
}

const name = 'addtest';

export default  angular.module(name, [
    angularMeteor,
    uiRouter,
    ngMaterial
  ]
)
.component(name,  {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: AddTest
})
.config(config);

function config($stateProvider) {
'ngInject';
$stateProvider
	.state('addtest', {
		url: '/addtest',
		template: '<addtest></addtest>'
	});
}
