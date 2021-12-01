const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => { // renders login page
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => { // logs user out
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => { // Logs user in
  const req = request;
  const res = response;

  // Force cast to strings for security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/forum' });
  });
};

const signup = (request, response) => { // Makes a new account
  const req = request;
  const res = response;

  // cast strings to cover up security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // Generate hash for account
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/forum' });
    });

    savePromise.catch((err) => {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error has occured' });
    });
  });
};

// Changes user password by running authenticate and genHash
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  // Cast to strings to check for sec flaws
  req.body.username = `${req.body.username}`;
  req.body.oldPass = `${req.body.oldPass}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.oldPass || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(req.body.username, req.body.oldPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      const accountData = {
        username: account.username,
        salt,
        password: hash,
      };

      const newAccount = account;
      newAccount.salt = accountData.salt;
      newAccount.password = accountData.password;
      const savePromise = newAccount.save();

      savePromise.then(() => {
        req.session.account = Account.AccountModel.toAPI(newAccount);
        return res.json({ redirect: '/forum' });
      });
      savePromise.catch(() => res.status(400).json({ error: 'An error has occured' }));
    });
  });
};

// Gets csrf token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

// returns current username
const returnUser = (request, response) => {
  const req = request;
  const res = response;

  res.json({ username: req.session.account.username });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.changePassword = changePassword;
module.exports.getToken = getToken;
module.exports.returnUser = returnUser;
