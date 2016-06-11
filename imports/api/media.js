export const Medias = new FS.Collection("media", {
  stores: [new FS.Store.FileSystem("media", {path: "/var/www/data/questionMedia"})]
});

Medias.allow({
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
