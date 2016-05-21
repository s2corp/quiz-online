import { Meteor } from 'meteor/meteor';
if (Meteor.isServer) {
  Meteor.publish('usersList', function() {
    return Meteor.users.find({}, {
      fields: {
        emails: 1,
        profile: 1
      }
    });
  });
}
