export const Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "../../../../../private/images"})]
});

Images.allow({
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
