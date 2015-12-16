// start up function that creates entries in the Websites databases.
Meteor.startup(function() {
  // code to run on server at startup
  if (!Websites.findOne()) {
    console.log("No websites yet. Creating starter data.");
    Websites.insert({
      title: "Goldsmiths Computing Department",
      url: "http://www.gold.ac.uk/computing/",
      description: "This is where this course was developed.",
      upVote: 0,
      downVote: 0,
      createdOn: new Date()
    });
    Websites.insert({
      title: "University of London",
      url: "http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
      description: "University of London International Programme.",
      upVote: 0,
      downVote: 0,
      createdOn: new Date()
    });
    Websites.insert({
      title: "Coursera",
      url: "http://www.coursera.org",
      description: "Universal access to the world’s best education.",
      upVote: 0,
      downVote: 0,
      createdOn: new Date()
    });
    Websites.insert({
      title: "Google",
      url: "http://www.google.com",
      description: "Popular search engine.",
      upVote: 0,
      downVote: 0,
      createdOn: new Date()
    });
  }
});

Websites.allow({
  insert: function(userId, website) {
    if (Meteor.user()) {
      if (Meteor.userId() === userId) {
        return true;
      }
    }

    return false;
  },
  update: function(userId, website) {
    if (Meteor.user()) {
      if (Meteor.userId() === userId) {
        return true;
      }
    }

    return false;
  }
});

Votes.allow({
  insert: function(userId, vote) {
    if (Meteor.user()) {
      if (Meteor.userId() === userId) {
        return true;
      }
    }

    return false;
  },
  update: function(userId, vote) {
    if (Meteor.user()) {
      if (Meteor.userId() === userId) {
        return true;
      }
    }

    return false;
  }
});

Comments.allow({
  insert: function(userId, comment) {
    if (Meteor.user()) {
      if (Meteor.userId() === userId) {
        return true;
      }
    }

    return false;
  },
  update: function(userId, comment) {
    if (Meteor.user()) {
      if (Meteor.userId() === userId) {
        return true;
      }
    }

    return false;
  }
});
