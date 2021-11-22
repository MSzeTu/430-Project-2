const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getUser', mid.requiresLogin, controllers.Account.returnUser);
  app.get('/upVote', mid.requiresLogin, controllers.Forum.upVote);
  app.get('/downVote', mid.requiresLogin, controllers.Forum.downVote);
  app.get('/getThreads', mid.requiresLogin, controllers.Forum.listThreads);
  app.post('/reset', mid.requiresSecure, mid.requiresLogout, controllers.Account.changePassword);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/forum', mid.requiresLogin, controllers.Forum.forumPage);
  app.post('/forum', mid.requiresLogin, controllers.Forum.startThread);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
