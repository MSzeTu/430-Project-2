const models = require('../models');

const { Thread } = models;

// Renders the main forum page
const forumPage = (req, res) => {
  Thread.ThreadModel.getAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }
    return res.render('threads', { csrfToken: req.csrfToken(), threads: docs });
  });
};

// Creates a new thread
const startThread = (req, res) => {
  if (!req.body.title || !req.body.text) {
    return res.status(400).json({ error: 'Thread name and content required' });
  }

  const threadData = {
    title: req.body.title,
    text: req.body.text,
    owner: req.session.account._id,
    ownerUser: req.session.account.username,
  };

  const newThread = new Thread.ThreadModel(threadData);

  const threadPromise = newThread.save();

  threadPromise.catch((err) => {
    console.log(err);
    if (err.code === 1100) {
      return res.status(400).json({ error: 'Thread of this title already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });
  res.status(200).json({ message: 'worked' });
  return threadPromise;
};

// Adds a comment to a thread
const addComment = (req, res) => {
  if (!req.body.text || req.body.thread === null) {
    return res.status(400).json({ error: 'Comment text required and a thread must be selected' });
  }

  const commentData = {
    text: req.body.text,
    owner: req.session.account._id,
    ownerUser: req.session.account.username,
  };

  const newComment = new Thread.CommentModel(commentData);

  const commentPromise = newComment.save();
  commentPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occured' });
  });
  return Thread.ThreadModel.findByID(req.body.thread, (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }
    if (!doc) {
      return res.json({ error: 'Thread not found' });
    }
    const newThread = doc;
    newThread.replies.push(newComment);
    const savePromise = newThread.save();
    savePromise.then(() => res.json({
      title: newThread.title,
      text: newThread.text,
      replies: newThread.replies,
      rating: newThread.rating,
      owner: newThread.owner,
      ownerUser: newThread.ownerUser,
      _id: newThread._id,
    }));
    savePromise.catch(() => res.status(400).json({ error: 'An error occured' }));
    return res;
  });
};

// Gets comments from open thread
const getCurrent = (req, res) => Thread.ThreadModel.findByID(req.query._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An Error occured' });
  }
  return res.json({ thread: docs });
});

// Changes the vote on the open thread
const changeVote = (request, response, voteType) => {
  const req = request;
  const res = response;
  return Thread.ThreadModel.findByID(req.query._id, (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }
    if (!doc) {
      return res.status(400).json({ error: 'Thread not found' });
    }
    if (doc.raters.includes(req.session.account._id)) {
      return res.status(400).json({ error: 'You have already voted on this post.' });
    }
    const newThread = doc;
    if (voteType === true) {
      newThread.rating++;
    } else {
      newThread.rating--;
    }
    newThread.raters.push(req.session.account._id);
    const savePromise = newThread.save();
    savePromise.then(() => res.json({
      title: newThread.title,
      text: newThread.text,
      replies: newThread.replies,
      rating: newThread.rating,
      owner: newThread.owner,
      ownerUser: newThread.ownerUser,
      _id: newThread._id,
    }));
    savePromise.catch(() => res.status(400).json({ error: 'An error occured' }));
    return res;
  });
};

// Downvotes thread
const downVote = (request, response) => changeVote(request, response, false);

// Upvotes thread
const upVote = (request, response) => changeVote(request, response, true);

// Lists all threads
const listThreads = (request, response) => {
  const res = response;

  return Thread.ThreadModel.getAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An Error occured' });
    }
    return res.json({ threads: docs });
  });
};

module.exports.forumPage = forumPage;
module.exports.listThreads = listThreads;
module.exports.startThread = startThread;
module.exports.upVote = upVote;
module.exports.downVote = downVote;
module.exports.addComment = addComment;
module.exports.getCurrent = getCurrent;
