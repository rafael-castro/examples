/////
// Routes
/////

Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.render('website_list', {
    to: 'content'
  });

  this.render('website_form', {
    to: 'website_form'
  });
});

Router.route('/:_id', function () {
  this.render('website_detail', {
    to: 'content',
    data: function () {
      return Websites.findOne({_id: this.params._id});
    }
  });
});

/////
// template helpers
/////

Template.body.helpers({
  username: function () {
    if (Meteor.user()) {
      return Meteor.user().username
    } else {
      return null;
    }
  }
});

// helper function that returns all available websites
Template.website_list.helpers({
  websites: function () {
    var filter = {};

    if (Session.get('search')) {
      var words = Session.get('search').split(' ');
      var re = new RegExp('(?:' + words.join('|') + ')');
      filter['$or'] = [
        {title: re},
        {description: re}
      ];
    }

    return Websites.find(filter, {sort:{upVote:-1}});
  }
});

Template.website_item.helpers({
  disableVoteButton: function () {
    if (Meteor.user()) {
      return '';
    } else {
      return 'disabled';
    }
  },
  getVote: function (websiteId, type) {
    if (Meteor.user()) {
      var userId = Meteor.userId();
      var votes = Votes.findOne({userId: userId, websiteId: websiteId});
      if (votes) {
        if (votes.vote === 1 && type === 'up') {
          return 'active';
        } else if (votes.vote === -1 && type === 'down') {
          return 'active';
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  }
});

Template.website_detail.helpers({
  disableVoteButton: function () {
    if (Meteor.user()) {
      return '';
    } else {
      return 'disabled';
    }
  },
  getVote: function (websiteId, type) {
    if (Meteor.user()) {
      var userId = Meteor.userId();
      var votes = Votes.findOne({userId: userId, websiteId: websiteId});
      if (votes) {
        if (votes.vote === 1 && type === 'up') {
          return 'active';
        } else if (votes.vote === -1 && type === 'down') {
          return 'active';
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  },
  getUsername: function (userId) {
    var user = Meteor.users.findOne(userId);
    if (user) {
      return user.username;
    } else {
      return null;
    }
  },
  comments: function (websiteId) {
    return Comments.find({websiteId: websiteId}, {sort: {addedOn: -1}});
  }
});

/////
// template events
/////

Template.website_list.events({
  'click .js-website-show-form': function (event) {
    $('#website_form').modal('show');
    $('#website_form').on('hidden.bs.modal', function (event) {
      $(this).trigger('reset');
      $('#website_error').text('');
      $('#website_error').addClass('hidden_div');
    });
  },
  'submit .js-website-search': function (event) {
    var search = event.target.search.value;
    Session.set('search', search);

    return false;
  },
  'reset .js-website-search': function (event) {
    Session.set('search', null);
  }
});

Template.website_item.events({
  'click .js-website-upvote': function (event) {
    if (Meteor.user()) {
      var websiteId = this._id;
      var userId = Meteor.userId();

      var votes = Votes.findOne({userId: userId, websiteId: websiteId});
      if (votes) {
        if (votes.vote === -1) {
          Websites.update(websiteId, {$inc: {'upVote': 1, 'downVote': -1}});
          Votes.update(votes._id, {$set: {vote: 1}});
        }
      } else {
        Votes.insert({userId: userId, websiteId: websiteId, vote: 1});
        Websites.update(websiteId, {$inc: {'upVote': 1}});
      }
    }

    return false;
  },
  'click .js-website-downvote': function (event) {
    if (Meteor.user()) {
      var websiteId = this._id;
      var userId = Meteor.userId();

      var votes = Votes.findOne({userId: userId, websiteId: websiteId});
      if (votes) {
        if (votes.vote === 1) {
          Websites.update(websiteId, {$inc: {'upVote': -1, 'downVote': 1}});
          Votes.update(votes._id, {$set: {vote: -1}});
        }
      } else {
        Votes.insert({userId: userId, websiteId: websiteId, vote: -1});
        Websites.update(websiteId, {$inc: {'downVote': 1}});
      }
    }

    return false;
  }
})

Template.website_detail.events({
  "click .js-website-upvote": function (event) {
    if (Meteor.user()) {
      var websiteId = this._id;
      var userId = Meteor.userId();

      var votes = Votes.findOne({userId: userId, websiteId: websiteId});
      if (votes) {
        if (votes.vote === -1) {
          Websites.update(websiteId, {$inc: {'upVote': 1, 'downVote': -1}});
          Votes.update(votes._id, {$set: {vote: 1}});
        }
      } else {
        Votes.insert({userId: userId, websiteId: websiteId, vote: 1});
        Websites.update(websiteId, {$inc: {'upVote': 1}});
      }
    }

    return false;
  },
  "click .js-website-downvote": function (event) {
    if (Meteor.user()) {
      var websiteId = this._id;
      var userId = Meteor.userId();

      var votes = Votes.findOne({userId: userId, websiteId: websiteId});
      if (votes) {
        if (votes.vote === 1) {
          Websites.update(websiteId, {$inc: {'upVote': -1, 'downVote': 1}});
          Votes.update(votes._id, {$set: {vote: -1}});
        }
      } else {
        Votes.insert({userId: userId, websiteId: websiteId, vote: -1});
        Websites.update(websiteId, {$inc: {'downVote': 1}});
      }
    }

    return false;
  },
  'submit .js-comment-add': function (event) {
    if (Meteor.user()) {
      var websiteId = this._id;
      var userId = Meteor.userId();

      var comment = event.target.comment.value;

      Comments.insert({
        websiteId: websiteId,
        comment: comment,
        addedBy: userId,
        addedOn: new Date
      });

      $(event.target).trigger('reset');
    }

    return false;
  }
})

Template.website_form.events({
  'submit .js-website-add': function (event) {

    if (Meteor.user()) {
      var url = event.target.url.value;
      var title = event.target.title.value;
      var description = event.target.description.value;

      Websites.insert({
        url: url,
        title: title,
        description: description,
        createdOn: new Date(),
        upVote: 0,
        downVote: 0,
        createdBy: Meteor.userId()
      }, function (err, id) {
        if (err) {
          $('#website_error').text(err.reason);
          $('#website_error').removeClass('hidden_div');
        } else {
          $('#website_form').modal('hide');
        }
      });
    }

    return false;
  }
});

Template.user_options.events({
  'click .js-user-show-login': function (event) {
    $('#login_form').modal('show');
    $('#login_form').on('hidden.bs.modal', function (event) {
      $(this).trigger('reset');
      $('#login_error').text('');
      $('#login_error').addClass('hidden_div');
    });
  },
  'click .js-user-logout': function (event) {
    Meteor.logout(function(err) {
      if (err) {
        console.log(err.message);
      }
    });
  },
  'click .js-user-show-register': function (event) {
    $('#register_form').modal('show');
    $('#register_form').on('hidden.bs.modal', function (event) {
      $(this).trigger('reset');
      $('#register_error').text('');
      $('#register_error').addClass('hidden_div');
    });
  },
});

Template.user_forms.events({
  'submit .js-user-login': function (event) {
    var user = event.target.user.value;
    var password = event.target.password.value;

    Meteor.loginWithPassword(user, password, function(err) {
      if (err) {
        $('#login_error').text(err.reason);
        $('#login_error').removeClass('hidden_div');
      } else {
        $('#login_form').modal('hide');
      }
    });

    return false;
  },
  'submit .js-user-register': function (event) {
    var username = event.target.username.value;
    var email = event.target.email.value;
    var password = event.target.password.value;

    Accounts.createUser({username:username, email:email, password:password}, function (err) {
      if (err) {
        $('#register_error').text(err.reason);
        $('#register_error').removeClass('hidden_div');
      } else {
        $('#register_form').modal('hide');
      }
    });

    return false;
  }
});
