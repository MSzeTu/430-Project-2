const models = require('../models');

const { Thread } = models;

const forumPage = (req, res) => {
  Thread.ThreadModel.getAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured' });
    }
    return res.render('threads', { csrfToken: req.csrfToken(), threads: docs });
  });
};

const startThread = (req, res) => {
  if (!req.body.title || !req.body.text) {
    return res.status(400).json({ error: 'Thread name and content required' });
  }

  const threadData = {
    title: req.body.title,
    text: req.body.text,
    owner: req.session.account._id,
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
  res.status(200).json({message: "worked"});
  return threadPromise;
};

const listThreads = (request, response) => {
  const req = request;
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
