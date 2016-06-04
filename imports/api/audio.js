export const Audioes = new FS.Collection("audioes", {
  stores: [new FS.Store.FileSystem("audioes", {path: "../../../../../public/questionAudioes"})]
});

Audioes.allow({
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
